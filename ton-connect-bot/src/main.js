"use strict";
exports.__esModule = true;
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
var bot_1 = require("./bot");
require("./connect-wallet-menu");
bot_1.bot.on('message', function (msg) {
    var chatId = msg.chat.id;
    bot_1.bot.sendMessage(chatId, 'Received your message');
});
