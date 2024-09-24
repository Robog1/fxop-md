const {Module, mode} = require("../lib");
const moment = require("moment-timezone");
const groupSchedules = new Map();

async function muteGroup(client, groupJid) {
try {
await client.groupSettingUpdate(groupJid, "announcement");
console.log(`Group ${groupJid} muted at ${new Date().toLocaleString()}`);
} catch (error) {
console.error(`Error muting group ${groupJid}:`, error);
}
}

async function unmuteGroup(client, groupJid) {
try {
await client.groupSettingUpdate(groupJid, "not_announcement");
console.log(`Group ${groupJid} unmuted at ${new Date().toLocaleString()}`);
} catch (error) {
console.error(`Error unmuting group ${groupJid}:`, error);
}
}

function checkSchedules(client) {
const now = moment();
for (const [groupJid, schedule] of groupSchedules.entries()) {
if (schedule.muteTime && now.format("HH:mm") === schedule.muteTime) {
muteGroup(client, groupJid);
}
if (schedule.unmuteTime && now.format("HH:mm") === schedule.unmuteTime) {
unmuteGroup(client, groupJid); 
}
}
}

function startScheduler(client) {
setInterval(() => checkSchedules(client), 60000);
}

Module(
{
pattern: "automute ?(.*)",
fromMe: mode,
desc: "AutoMute the group at a specified time",
type: "management"
},
async (message, match, m, client) => {
if (!message.isGroup) return message.reply("This command can only be used in groups.");

const time = match ? match.trim() : "";
if (!time || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) {
return message.reply("Please provide a valid time in 24-hour format. For example: .automute 22:30");
}

const groupJid = message.jid;
const schedule = groupSchedules.get(groupJid) || {};
schedule.muteTime = time;
groupSchedules.set(groupJid, schedule);

return message.reply(`Auto-mute time set to ${time}.`);
}
);

Module(
{
pattern: "aunmute ?(.*)",
fromMe: mode,
desc: "Auto UnMute the group at a specified time",
type: "management"
},
async (message, match, m, client) => {
if (!message.isGroup) return message.reply("This command can only be used in groups.");

const time = match ? match.trim() : "";
if (!time || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) {
return message.reply("Please provide a valid time in 24-hour format. For example: .aunmute 07:00");
}

const groupJid = message.jid;
const schedule = groupSchedules.get(groupJid) || {};
schedule.unmuteTime = time;
groupSchedules.set(groupJid, schedule);

return message.reply(`Auto-unmute time set to ${time}.`);
}
);

Module(
{
pattern: "getmute ?(.*)",
fromMe: mode,
desc: "Get Auto Mute | Unmute Times Set for a Group",
type: "management"
},
async (message, match, m, client) => {
if (!message.isGroup) return message.reply("This command can only be used in groups.");

const groupJid = message.jid;
const schedule = groupSchedules.get(groupJid);

if (schedule) {
return message.reply(`Auto-mute time: ${schedule.muteTime || "Not set"}\nAuto-unmute time: ${schedule.unmuteTime || "Not set"}`);
} else {
return message.reply("No auto-mute/unmute schedule set for this group.");
}
}
);

function onReady(client) {
startScheduler(client);
console.log("Auto mute/unmute scheduler started");
}

onReady();
