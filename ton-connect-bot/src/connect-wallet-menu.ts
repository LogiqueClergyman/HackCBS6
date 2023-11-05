import { TelegramBot } from 'node-telegram-bot-api'; // Import TelegramBot
import { getWallets, getWalletInfo } from './ton-connect/wallets';
import { bot } from './bot';
import fs from 'fs'; // Import fs library
import { getConnector } from './ton-connect/connector';
import QRCode from 'qrcode';

export const walletMenuCallbacks = {
    chose_wallet: onChooseWalletClick,
    select_wallet: onWalletClick,
    universal_qr: onOpenUniversalQRClick,
};

async function onChooseWalletClick(query: TelegramBot.CallbackQuery, _: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const wallets = await getWallets();

    const walletButtons = wallets.map((wallet) => [
        {
            text: wallet.name,
            callback_data: JSON.stringify({ method: 'select_wallet', data: wallet.appName }),
        },
    ]);

    const inlineKeyboard = [
        ...walletButtons,
        [
            {
                text: '« Back',
                callback_data: JSON.stringify({
                    method: 'universal_qr',
                }),
            },
        ],
    ];

    await bot.editMessageText('Select a wallet:', {
        chat_id: chatId,
        message_id: query.message!.message_id,
        reply_markup: {
            inline_keyboard: inlineKeyboard,
        },
    });
}

async function onOpenUniversalQRClick(query: TelegramBot.CallbackQuery, _: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const wallets = await getWallets();

    const connector = getConnector(chatId);

    connector.onStatusChange((wallet) => {
        if (wallet) {
            bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
        }
    });

    const link = connector.connect(wallets);

    await editQR(query.message, link, chatId);

    const inlineKeyboard = [
        [
            {
                text: 'Choose a Wallet',
                callback_data: JSON.stringify({ method: 'chose_wallet' }),
            },
            {
                text: 'Open Link',
                url: `https://ton-connect.github.io/open-tc?connect=${encodeURIComponent(link)}`,
            },
        ],
    ];

    await bot.editMessageText('Wallet connected!', {
        chat_id: chatId,
        message_id: query.message!.message_id,
        reply_markup: {
            inline_keyboard: inlineKeyboard,
        },
    });
}

async function onWalletClick(query: TelegramBot.CallbackQuery, data: string): Promise<void> {
    const chatId = query.message!.chat.id;
    const connector = getConnector(chatId);

    connector.onStatusChange((wallet) => {
        if (wallet) {
            bot.sendMessage(chatId, `${wallet.device.appName} wallet connected!`);
        }
    });

    const selectedWallet = await getWalletInfo(data);
    if (!selectedWallet) {
        return;
    }

    const link = connector.connect({
        bridgeUrl: selectedWallet.bridgeUrl as string,
        universalLink: selectedWallet.universalLink as string,
    });

    await editQR(query.message, link, chatId);

    const inlineKeyboard = [
        [
            {
                text: '« Back',
                callback_data: JSON.stringify({ method: 'chose_wallet' }),
            },
            {
                text: `Open ${selectedWallet.name}`,
                url: link,
            },
        ],
    ];

    await bot.editMessageText('Wallet connected!', {
        chat_id: chatId,
        message_id: query.message!.message_id,
        reply_markup: {
            inline_keyboard: inlineKeyboard,
        },
    });
}

async function editQR(message: TelegramBot.Message, link: string, chatId: number): Promise<void> {
    const fileName = 'QR-code-' + Math.round(Math.random() * 10000000000);

    await QRCode.toFile(`./${fileName}.png`, link);

    bot.sendPhoto(chatId, `./${fileName}.png`, {
        reply_to_message_id: message.message_id,
    });

    await new Promise((resolve) => fs.unlink(`./${fileName}.png`, resolve));
}
