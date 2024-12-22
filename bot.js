const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const axios = require('axios');
const interactionDataset = require('./interactionDataset'); // Import the interaction dataset

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Global object to track user interactions
let registrationData = {};

// Function to show the main menu
const showMainMenu = (chatId) => {
  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'About the Bot', callback_data: 'about' }],
        [{ text: 'Check Leave Balance', callback_data: 'leave_balance' }],
        [{ text: 'View Your Assets', callback_data: 'view_assets' }],
        [{ text: 'Colleagues on Leave Today', callback_data: 'colleagues_on_leave' }],
        [{ text: 'Chat with Bot', callback_data: 'chat' }],
      ],
    },
  };
  bot.sendMessage(chatId, '👋 Main Menu: Please select an option below:', options);
};

// Start command: Show the main menu and share contact button
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Send message with Share Contact button
  const options = {
    reply_markup: {
      keyboard: [
        [{ text: '📱 Share My Phone Number', request_contact: true }],
      ],
      resize_keyboard: true,
      one_time_keyboard: true, // Automatically hides the keyboard after one use
    },
  };

  bot.sendMessage(
    chatId,
    '👋 Welcome! To get started, please share your phone number by clicking the button below:',
    options
  );
});

// Handle contact sharing
bot.on('contact', async (msg) => {
  const chatId = msg.chat.id;
  const contact = msg.contact;

  if (contact) {
    try {
        // if (interactionDataset.contact) {
        //     const contactResponse = interactionDataset.contact[0].response[Math.floor(Math.random() * interactionDataset.contact[0].response.length)];
        //     bot.sendMessage(chatId, contactResponse);
        //   }
      // Send the phone number to the server
      const contactResponse = interactionDataset.contact[0].response[0];
      bot.sendMessage(chatId, contactResponse);
     const response= await axios.post('http://localhost:3000/api/contacts', {
        phone_number: contact.phone_number,
        chat_id: chatId,
      });
  console.log("hello",response.data.contact);
      // Send confirmation and main menu
      if(response.status===201){
      bot.sendMessage(chatId, `✅ Thank you! Your phone number (${response.data.contact.contact[0].phone_number}) has been registered.`)
        .then(() => {
          bot.sendMessage(chatId, '📢 You will now receive important notifications, such as leave balance updates and other updates.');
          showMainMenu(chatId);
        });
    }
    else{
        bot.sendMessage(chatId, `✅ Thank you! Your phone number (${response.data.contact.contact[0].phone_number}) already registered.`)
        .then(() => {
          bot.sendMessage(chatId, '📢 You will now receive important notifications, such as leave balance updates and other updates.');
          showMainMenu(chatId);
        });
    }

    } catch (error) {
      console.error('Error saving phone number:', error.message);
      bot.sendMessage(chatId, '❌ Failed to save your phone number. Please try again.');
    }
    return ; 
  }
  else {
    // Fallback to interaction dataset if no contact is shared
    handleUserInteraction(msg, chatId);
  }
});

// Handle button clicks
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const action = query.data;

  if (action === 'about') {
    bot.sendMessage(chatId, '🤖 This bot helps you register your phone number and provides other features. Explore more by interacting with the options!')
      .then(() => showMainMenu(chatId));
  } else if (action === 'chat') {
    bot.sendMessage(chatId, '💬 Let\'s start chatting! Please type your message.');
  } else if (action === 'leave_balance') {
    // Fetch leave balance from the server
    try {
      const response = await axios.get(`http://localhost:3000/api/leave-balance/${chatId}`);
      const leaveBalance = response.data.leave_balance;
      bot.sendMessage(chatId, `📊 Your current leave balance is: ${leaveBalance} days.`);
    } catch (error) {
      console.error('Error fetching leave balance:', error.message);
      bot.sendMessage(chatId, '❌ Failed to fetch your leave balance. Please try again later.');
    }
  } else if (action === 'view_assets') {
    // Fetch assets from the server
    try {
      const response = await axios.get(`http://localhost:3000/api/assets/${chatId}`);
      const assets = response.data.assets;
      if (assets.length > 0) {
        const assetList = assets.map((asset) => `- ${asset.name}`).join('\n');
        bot.sendMessage(chatId, `📦 Your assets:\n${assetList}`);
      } else {
        bot.sendMessage(chatId, '📦 You currently have no assets assigned.');
      }
    } catch (error) {
      console.error('Error fetching assets:', error.message);
      bot.sendMessage(chatId, '❌ Failed to fetch your assets. Please try again later.');
    }
  } else if (action === 'colleagues_on_leave') {
    // Fetch colleagues on leave today
    try {
      const response = await axios.get(`http://localhost:3000/api/colleagues-on-leave/${chatId}`);
      const colleagues = response.data.colleagues;
      if (colleagues.length > 0) {
        const colleagueList = colleagues.map((colleague) => `- ${colleague.name}`).join('\n');
        bot.sendMessage(chatId, `🏖️ Colleagues on leave today:\n${colleagueList}`);
      } else {
        bot.sendMessage(chatId, '🏖️ No colleagues are on leave today.');
      }
    } catch (error) {
      console.error('Error fetching colleagues on leave:', error.message);
      bot.sendMessage(chatId, '❌ Failed to fetch colleagues on leave. Please try again later.');
    }
  }
});

// Handle user interactions (dynamic responses based on interactionDataset)
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text?.toLowerCase();

  // Check if the message matches any triggers in the interaction dataset
  if (userMessage) {
    for (let category of Object.values(interactionDataset)) {
      for (let { trigger, response } of category) {
        if (trigger.some((word) => userMessage.includes(word))) {
          const randomResponse = response[Math.floor(Math.random() * response.length)];
          bot.sendMessage(chatId, randomResponse);
          return; // Stop after sending a response
        }
      }
    }
  }
    if(!msg.contact){
  // If no match is found, respond with a default "unknown" message
  const defaultResponse = interactionDataset.unknown[0].response[Math.floor(Math.random() * interactionDataset.unknown[0].response.length)];
  bot.sendMessage(chatId, defaultResponse);
    }
});

// Handle polling errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error.message);
});
