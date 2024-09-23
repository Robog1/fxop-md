const pino = require("pino");
const path = require("path");
const fs = require("fs");
const plugins = require("./plugins");
const {connectSession} = require("./auth");
const {default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, Browsers, makeCacheableSignalKeyStore, DisconnectReason} = require("baileys");
const {PausedChats, loadMessage, saveMessage, saveChat, getName} = require("./db/store");
const {serialize} = require("./serialize");
const {Greetings} = require("./src/greet");
const config = require("../config");
const {Image, Message, Sticker, Video, AllMessage} = require("./class");

const logger = pino({level: "silent"});
const connect = async () => {
	const sessionDir = "../session";
	if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir);
	await connectSession();
	const {state, saveCreds} = await useMultiFileAuthState(path.join(__basedir, sessionDir));
	const {version} = await fetchLatestBaileysVersion();

	const conn = makeWASocket({
		auth: {
			creds: state.creds,
			keys: makeCacheableSignalKeyStore(state.keys, logger)
		},
		printQRInTerminal: false,
		logger,
		browser: Browsers.ubuntu("Desktop"),
		downloadHistory: true,
		syncFullHistory: true,
		markOnlineOnConnect: true,
		emitOwnEvents: true,
		version,
		getMessage: async key => (loadMessage(key.id) || {}).message || {conversation: null}
	});

	conn.ev.on("connection.update", handleConnectionUpdate(conn));
	conn.ev.on("creds.update", saveCreds);
	conn.ev.on("group-participants.update", async data => Greetings(data, conn));
	conn.ev.on("chats.update", async chats => chats.forEach(async chat => await saveChat(chat)));
	conn.ev.on("messages.upsert", handleMessages(conn));

	const handleErrors = async err => {
		const {message, stack} = err;
		const fileName = stack?.split("\n")[1]?.trim();
		const errorText = `\`\`\`─━❲ ERROR REPORT ❳━─\nMessage: ${message}\nFrom: ${fileName}\`\`\``;
		await conn.sendMessage(conn.user.id, {text: errorText});
		console.error(message, fileName);
	};

	process.on("unhandledRejection", handleErrors);
	process.on("uncaughtException", handleErrors);
	return conn;
};

const handleConnectionUpdate =
	conn =>
	async ({connection, lastDisconnect}) => {
		console.log(connection === "connecting" ? "Connecting..." : connection === "open" ? "Connected" : "Disconnected");
		if (connection === "open") {
			const {version} = require("../package.json");
			const alive = `FX CONNECTED ${version}\nPrefix: ${config.HANDLERS}\nPlugins: ${plugins.commands.length}\nWorktype: ${config.WORK_TYPE}`;
			await conn.sendMessage(conn.user.id, {text: alive});
		} else if (connection === "close" && lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
			setTimeout(connect, 10000);
		} else if (connection === "close") {
			setTimeout(() => process.exit(0), 3000);
		}
	};

const handleMessages = conn => async m => {
	if (m.type !== "notify") return;
	let msg = await serialize(JSON.parse(JSON.stringify(m.messages[0])), conn);
	await saveMessage(m.messages[0], msg.sender);
	if (config.AUTO_READ) await conn.readMessages(msg.key);
	if (config.AUTO_STATUS_READ && msg.from === "status@broadcast") await conn.readMessages(msg.key);

	if (!msg) return;

	const text_msg = msg.body;
	const isResume = new RegExp(`${config.HANDLERS}( ?resume)`, "is").test(text_msg);
	const chatId = msg.from;
	const pausedChats = await PausedChats.getPausedChats();

	if (pausedChats.some(pausedChat => pausedChat.chatId === chatId && !isResume)) return;

	if (config.LOGS) {
		const name = await getName(msg.sender);
		const groupName = msg.from.endsWith("@g.us") ? (await conn.groupMetadata(msg.from)).subject : msg.from;
		console.log(`At: ${groupName}\nFrom: ${name}\nMessage: ${text_msg || msg.type}`);
	}

	const handleCommand = (Instance, args) => {
		const whats = new Instance(conn, msg);
		command.function(whats, ...args, msg, conn, m);
	};

	plugins.commands.forEach(async command => {
		if (command.fromMe && !msg.sudo) return;

		if (text_msg && command.pattern) {
			let iscommand = text_msg.match(command.pattern);
			if (iscommand) {
				let [, prefix, , match] = iscommand;
				msg.prefix = prefix;
				msg.command = prefix + iscommand[2];
				handleCommand(Message, [match || false]);
			}
		} else {
			switch (command.on) {
				case "text":
					if (text_msg) handleCommand(Message, [text_msg]);
					break;
				case "image":
					if (msg.type === "imageMessage") handleCommand(Image, [text_msg]);
					break;
				case "sticker":
					if (msg.type === "stickerMessage") handleCommand(Sticker, []);
					break;
				case "video":
					if (msg.type === "videoMessage") handleCommand(Video, []);
					break;
				case "delete":
					if (msg.type === "protocolMessage") {
						const whats = new Message(conn, msg);
						whats.messageId = msg.message.protocolMessage.key?.id;
						command.function(whats, msg, conn, m);
					}
					break;
				case "message":
					handleCommand(AllMessage, []);
					break;
			}
		}
	});
};

module.exports = {connect};
