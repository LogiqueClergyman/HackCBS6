"use strict";
exports.__esModule = true;
exports.bot = void 0;
var node_telegram_bot_api_1 = require("node-telegram-bot-api");
var process = require("process");
var token = process.env.TELEGRAM_BOT_TOKEN;
exports.bot = new node_telegram_bot_api_1["default"](token, { polling: true });
