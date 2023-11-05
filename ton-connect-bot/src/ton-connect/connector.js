"use strict";
exports.__esModule = true;
exports.getConnector = void 0;
var sdk_1 = require("@tonconnect/sdk");
var storage_1 = require("./storage");
var process = require("process");
function getConnector(chatId) {
    return new sdk_1["default"]({
        manifestUrl: process.env.MANIFEST_URL,
        storage: new storage_1.TonConnectStorage(chatId)
    });
}
exports.getConnector = getConnector;
