import * as dotenv from 'dotenv';
dotenv.config();

import { bot } from './bot';
import './connect-wallet-menu';

bot.on('message', msg => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Received your message');
});
