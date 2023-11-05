"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.walletMenuCallbacks = void 0;
var wallets_1 = require("./ton-connect/wallets");
var bot_1 = require("./bot");
var connector_1 = require("./ton-connect/connector");
exports.walletMenuCallbacks = {
    chose_wallet: onChooseWalletClick,
    select_wallet: onWalletClick,
    universal_qr: onOpenUniversalQRClick
};
function onChooseWalletClick(query, _) {
    return __awaiter(this, void 0, void 0, function () {
        var chatId, wallets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatId = query.message.chat.id;
                    return [4 /*yield*/, (0, wallets_1.getWallets)()];
                case 1:
                    wallets = _a.sent();
                    return [4 /*yield*/, bot_1.bot.editMessageReplyMarkup({
                            inline_keyboard: [
                                wallets.map(function (wallet) { return ({
                                    text: wallet.name,
                                    callback_data: JSON.stringify({ method: 'select_wallet', data: wallet.appName })
                                }); }),
                                [
                                    {
                                        text: '« Back',
                                        callback_data: JSON.stringify({
                                            method: 'universal_qr'
                                        })
                                    }
                                ]
                            ]
                        }, {
                            message_id: query.message.message_id,
                            chat_id: query.message.chat.id
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function onOpenUniversalQRClick(query, _) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var chatId, wallets, connector, link;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    chatId = query.message.chat.id;
                    return [4 /*yield*/, (0, wallets_1.getWallets)()];
                case 1:
                    wallets = _c.sent();
                    connector = (0, connector_1.getConnector)(chatId);
                    connector.onStatusChange(function (wallet) {
                        if (wallet) {
                            bot_1.bot.sendMessage(chatId, "".concat(wallet.device.appName, " wallet connected!"));
                        }
                    });
                    link = connector.connect(wallets);
                    return [4 /*yield*/, editQR(query.message, link)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, bot_1.bot.editMessageReplyMarkup({
                            inline_keyboard: [
                                [
                                    {
                                        text: 'Choose a Wallet',
                                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                                    },
                                    {
                                        text: 'Open Link',
                                        url: "https://ton-connect.github.io/open-tc?connect=".concat(encodeURIComponent(link))
                                    }
                                ]
                            ]
                        }, {
                            message_id: (_a = query.message) === null || _a === void 0 ? void 0 : _a.message_id,
                            chat_id: (_b = query.message) === null || _b === void 0 ? void 0 : _b.chat.id
                        })];
                case 3:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function onWalletClick(query, data) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var chatId, connector, selectedWallet, link;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    chatId = query.message.chat.id;
                    connector = (0, connector_1.getConnector)(chatId);
                    connector.onStatusChange(function (wallet) {
                        if (wallet) {
                            bot_1.bot.sendMessage(chatId, "".concat(wallet.device.appName, " wallet connected!"));
                        }
                    });
                    return [4 /*yield*/, (0, wallets_1.getWalletInfo)(data)];
                case 1:
                    selectedWallet = _b.sent();
                    if (!selectedWallet) {
                        return [2 /*return*/];
                    }
                    link = connector.connect({
                        bridgeUrl: selectedWallet.bridgeUrl,
                        universalLink: selectedWallet.universalLink
                    });
                    return [4 /*yield*/, editQR(query.message, link)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, bot_1.bot.editMessageReplyMarkup({
                            inline_keyboard: [
                                [
                                    {
                                        text: '« Back',
                                        callback_data: JSON.stringify({ method: 'chose_wallet' })
                                    },
                                    {
                                        text: "Open ".concat(selectedWallet.name),
                                        url: link
                                    }
                                ]
                            ]
                        }, {
                            message_id: (_a = query.message) === null || _a === void 0 ? void 0 : _a.message_id,
                            chat_id: chatId
                        })];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
