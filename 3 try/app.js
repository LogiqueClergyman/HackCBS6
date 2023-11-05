const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Handle any polling errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error.message);
  // Implement a retry mechanism here if necessary
});

// This object will store user data temporarily
const userSessions = {};

// Welcome message and initial menu
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  // Store the user's chat ID in the session
  userSessions[chatId] = { userId: msg.from.id };

  const welcomeMessage = "Welcome to TON Metro Ticket! Please select a starting station:";
  const options = {
    reply_markup: {
      keyboard: [["Station 1", "Station 2"], ["Station 3", "Station 4"]],
      resize_keyboard: true,
      one_time_keyboard: true, 
    },
  };

  bot.sendMessage(chatId, welcomeMessage, options);
});

// Handle station selection
bot.onText(/Station (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const selectedStation = match[1];
  
    // Ensure that the userSessions[chatId] object exists
    if (!userSessions[chatId]) {
      userSessions[chatId] = { userId: msg.from.id };
    } 
  
    // Store the selected station in the session
    userSessions[chatId].startStation = `Station ${selectedStation}`;
  
    const options = {
      reply_markup: {
        keyboard: [["Station A", "Station B"], ["Station C", "Station D"]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    };
  
    bot.sendMessage(chatId, `You selected ${userSessions[chatId].startStation}. Now, please select an ending station:`, options);
  });
  

// Handle ending station selection
bot.onText(/Station ([A-D])/, (msg, match) => {
  const chatId = msg.chat.id;
  const selectedEndingStation = match[1];

  // Store the selected ending station in the session
  userSessions[chatId].endStation = `Station ${selectedEndingStation}`;

  // Generate a random price
  const randomPrice = Math.floor(Math.random() * 100);

  // Get user data from the session
  const { userId } = userSessions[chatId];
    
  // Send user information and the random price
  bot.sendMessage(chatId, `User ID: ${userId}\n
  Username: ${msg.from.username}\n
  Start Station: ${userSessions[chatId].startStation}\n
  Ending Station: ${userSessions[chatId].endStation}\n
  Price: RS ${randomPrice}`);
  
  console.log(`User ID: ${userId}\n
  Username: ${msg.from.username}\n
  Start Station: ${userSessions[chatId].startStation}\n
  Ending Station: ${userSessions[chatId].endStation}\n
  Price: RS ${randomPrice}`);

  // Remove user data from the session
  delete userSessions[chatId];
});

// Listen for any kind of message
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // Send a message to the chat acknowledging receipt of the message
  bot.sendMessage(chatId, 'Okay then next.');
});
