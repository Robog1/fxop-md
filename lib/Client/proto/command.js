const config = require('../../../config');
const commands = [];
function Module(commandInfo, func) {
 commandInfo.function = func;
 if (commandInfo.pattern) {
  commandInfo.originalPattern = commandInfo.pattern;
  commandInfo.pattern = new RegExp(`^(${config.HANDLERS})\\s*(${commandInfo.pattern})(?:\\s+(.*))?$`, 'i');
 }
 commandInfo.dontAddCommandList = commandInfo.dontAddCommandList || false;
 commandInfo.fromMe = commandInfo.fromMe || false;
 commandInfo.type = commandInfo.type || 'misc';

 commands.push(commandInfo);
 return commandInfo;
}

module.exports = {
 Module,
 commands
};
