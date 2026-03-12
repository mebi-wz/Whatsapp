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
        [{ text: 'Find a Service', callback_data: 'find_service' }],
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

// Function to show role selection
const showRoleSelection = (chatId) => {
  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '👤 I am a Client', callback_data: 'role_client' }],
        [{ text: '🛠️ I am a Service Provider', callback_data: 'role_provider' }],
      ],
    },
  };
  bot.sendMessage(chatId, '❓ Please select your role:', options);
};

// Function to show categories for providers or clients
const showCategorySelection = (chatId, type = 'provider') => {
  const categories = ['Plumbing', 'Electrician', 'Cleaning', 'Carpentry'];
  const prefix = type === 'provider' ? 'cat_' : 'find_';
  const options = {
    reply_markup: {
      inline_keyboard: categories.map(cat => [{ text: cat, callback_data: `${prefix}${cat}` }]),
    },
  };
  bot.sendMessage(chatId, `📂 Please select a service category (${type}):`, options);
};

// Function to show locations in Addis Ababa
const showLocationSelection = (chatId, type = 'provider', category = '') => {
  const locations = ['Arada', 'Bole', 'Kirkos', 'Lideta', 'Yeka', 'Addis Ketema', 'Akaky Kaliti', 'Gullele', 'Kolfe', 'Nifas Silk'];
  const prefix = type === 'provider' ? `locp_${category}_` : `locc_${category}_`;
  
  const keyboard = [];
  for (let i = 0; i < locations.length; i += 2) {
    const row = [{ text: locations[i], callback_data: `${prefix}${locations[i]}` }];
    if (locations[i+1]) {
      row.push({ text: locations[i+1], callback_data: `${prefix}${locations[i+1]}` });
    }
    keyboard.push(row);
  }

  const options = {
    reply_markup: {
      inline_keyboard: keyboard,
    },
  };
  bot.sendMessage(chatId, '📍 Please select a location in Addis Ababa:', options);
};

const searchProviders = async (chatId, category, location) => {
    try {
      const response = await axios.get(`http://localhost:${process.env.PORT || 3006}/api/providers/${category}?location=${location}`);
      const providers = response.data.providers;
      if (providers && providers.length > 0) {
        const providerList = providers.map(p => `👤 Provider\n📞 ${p.phone_number}\n📍 ${p.location}\n📝 ${p.service_details || 'No details provided.'}`).join('\n\n');
        bot.sendMessage(chatId, `📍 Available ${category} Providers in ${location}:\n\n${providerList}`)
          .then(() => showMainMenu(chatId));
      } else {
        bot.sendMessage(chatId, `😔 Sorry, no ${category} providers found in ${location} yet. Try another location?`)
          .then(() => showMainMenu(chatId));
      }
    } catch (error) {
       bot.sendMessage(chatId, '❌ Failed to fetch providers.');
    }
};

// Global object to track user state for multi-step interactions
const userState = {};

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
      const response= await axios.post(`http://localhost:${process.env.PORT || 3006}/api/contacts`, {
        phone_number: contact.phone_number.replace(/\s+/g, ''),
        chat_id: chatId,
      });
  console.log("hello",response.data.contact);
      // Send confirmation and main menu
      const contactData = response.data.contact.contact;
      const registeredPhone = Array.isArray(contactData) ? contactData[0].phone_number : contactData.phone_number;

      if(response.status===201){
        bot.sendMessage(chatId, `✅ Thank you! Your phone number (${registeredPhone}) has been registered.`, {
          reply_markup: {
            keyboard: [[{ text: '📋 Show Menu' }]],
            resize_keyboard: true,
          }
        })
          .then(() => {
            bot.sendMessage(chatId, '📢 You will now receive important notifications, such as leave balance updates and other updates.');
            showRoleSelection(chatId);
          });
      }
      else {
        bot.sendMessage(chatId, `✅ Thank you! Your phone number (${registeredPhone}) is already registered.`, {
          reply_markup: {
            keyboard: [[{ text: '📋 Show Menu' }]],
            resize_keyboard: true,
          }
        })
          .then(() => {
            showRoleSelection(chatId);
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
      const response = await axios.get(`http://localhost:${process.env.PORT || 3007}/api/leave-balance/${chatId}`);
      const leaveBalance = response.data.leave_balance;
      bot.sendMessage(chatId, `📊 Your current leave balance is: ${leaveBalance} days.`);
    } catch (error) {
      console.error('Error fetching leave balance:', error.message);
      bot.sendMessage(chatId, 'you are not an employee at hagbes')
        .then(() => showMainMenu(chatId));
    }
  } else if (action === 'view_assets') {
    // Fetch assets from the server
    try {
      const response = await axios.get(`http://localhost:${process.env.PORT || 3007}/api/assets/${chatId}`);
      const assets = response.data.assets;
      if (assets.length > 0) {
        const assetList = assets.map((asset) => `- ${asset.name}`).join('\n');
        bot.sendMessage(chatId, `📦 Your assets:\n${assetList}`);
      } else {
        bot.sendMessage(chatId, '📦 You currently have no assets assigned.');
      }
    } catch (error) {
      console.error('Error fetching assets:', error.message);
      bot.sendMessage(chatId, 'you are not an employee at hagbes')
        .then(() => showMainMenu(chatId));
    }
  } else if (action === 'colleagues_on_leave') {
    // Fetch colleagues on leave today
    try {
      const response = await axios.get(`http://localhost:${process.env.PORT || 3007}/api/colleagues-on-leave/${chatId}`);
      const colleagues = response.data.colleagues;
      if (colleagues.length > 0) {
        const colleagueList = colleagues.map((colleague) => `- ${colleague.name}`).join('\n');
        bot.sendMessage(chatId, `🏖️ Colleagues on leave today:\n${colleagueList}`);
      } else {
        bot.sendMessage(chatId, '🏖️ No colleagues are on leave today.');
      }
    } catch (error) {
      console.error('Error fetching colleagues on leave:', error.message);
      bot.sendMessage(chatId, 'you are not an employee at hagbes')
        .then(() => showMainMenu(chatId));
    }
  } else if (action === 'role_client') {
    try {
      await axios.post(`http://localhost:${process.env.PORT || 3006}/api/update-role`, { chat_id: chatId, role: 'client' });
      bot.sendMessage(chatId, '✅ Role set to Client. How can I help you?')
        .then(() => showMainMenu(chatId));
    } catch (error) {
       bot.sendMessage(chatId, '❌ Failed to update role.');
    }
  } else if (action === 'role_provider') {
    try {
      await axios.post(`http://localhost:${process.env.PORT || 3006}/api/update-role`, { chat_id: chatId, role: 'provider' });
      showCategorySelection(chatId, 'provider');
    } catch (error) {
       bot.sendMessage(chatId, '❌ Failed to update role.');
    }
  } else if (action.startsWith('cat_')) {
    const category = action.replace('cat_', '');
    if (category === 'Other') {
      userState[chatId] = { step: 'awaiting_category', type: 'provider' };
      bot.sendMessage(chatId, '✏️ Please type your custom service category:');
    } else {
      showLocationSelection(chatId, 'provider', category);
    }
  } else if (action.startsWith('locp_')) {
    const parts = action.split('_');
    const category = parts[1];
    const location = parts[2];
    if (location === 'Other') {
      userState[chatId] = { step: 'awaiting_location', type: 'provider', category: category };
      bot.sendMessage(chatId, '✏️ Please type your location:');
    } else {
      try {
        await axios.post(`http://localhost:${process.env.PORT || 3006}/api/update-category`, { chat_id: chatId, category: category });
        await axios.post(`http://localhost:${process.env.PORT || 3006}/api/update-location`, { chat_id: chatId, location: location });
        bot.sendMessage(chatId, `✅ Location set to: ${location}. Now, please tell me a bit more about your services (e.g., "Specialist in pipe repairs").`);
        userState[chatId] = { step: 'awaiting_details', type: 'provider' };
      } catch (error) {
         bot.sendMessage(chatId, '❌ Failed to update location/category.');
      }
    }
  } else if (action === 'find_service') {
    showCategorySelection(chatId, 'client');
  } else if (action.startsWith('find_')) {
    const category = action.replace('find_', '');
    if (category === 'Other') {
      userState[chatId] = { step: 'awaiting_category', type: 'client' };
      bot.sendMessage(chatId, '✏️ Please type the service category you are looking for:');
    } else {
      showLocationSelection(chatId, 'client', category);
    }
  } else if (action.startsWith('locc_')) {
    const parts = action.split('_');
    const category = parts[1];
    const location = parts[2];
    if (location === 'Other') {
       userState[chatId] = { step: 'awaiting_location', type: 'client', category: category };
       bot.sendMessage(chatId, '✏️ Please type the location you are looking in:');
    } else {
       searchProviders(chatId, category, location);
    }
  }
});

// Handle user interactions (dynamic responses based on interactionDataset)
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text?.toLowerCase();

  if (!userMessage) return;

  if (userMessage === '📋 show menu' || userMessage === 'main menu' || userMessage === 'menu') {
    return showMainMenu(chatId);
  }

  // Handle multi-step states
  const state = userState[chatId];
  if (state) {
    if (state.step === 'awaiting_category') {
      const customCategory = msg.text;
      delete userState[chatId];
      showLocationSelection(chatId, state.type, customCategory);
      return;
    } else if (state.step === 'awaiting_location') {
      const customLocation = msg.text;
      const category = state.category;
      if (state.type === 'provider') {
         try {
            await axios.post(`http://localhost:${process.env.PORT || 3006}/api/update-category`, { chat_id: chatId, category: category });
            await axios.post(`http://localhost:${process.env.PORT || 3006}/api/update-location`, { chat_id: chatId, location: customLocation });
            bot.sendMessage(chatId, `✅ Location set to: ${customLocation}. Now, please tell me a bit more about your services.`);
            userState[chatId] = { step: 'awaiting_details', type: 'provider' };
         } catch (error) {
            bot.sendMessage(chatId, '❌ Failed to update location/category.');
            delete userState[chatId];
         }
      } else {
         delete userState[chatId];
         searchProviders(chatId, category, customLocation);
      }
      return;
    } else if (state.step === 'awaiting_details') {
      try {
        await axios.post(`http://localhost:${process.env.PORT || 3006}/api/update-service-details`, { chat_id: chatId, service_details: msg.text });
        delete userState[chatId];
        bot.sendMessage(chatId, '✅ Service details saved! You are now fully registered as a Provider.')
          .then(() => showMainMenu(chatId));
      } catch (error) {
        bot.sendMessage(chatId, '❌ Failed to save service details.');
        delete userState[chatId];
      }
      return;
    }
  }

  // Intelligence Suggestion
  const serviceKeywords = ['plumber', 'electrician', 'leak', 'wire', 'clean', 'fix', 'broken', 'repair'];
  if (serviceKeywords.some(kw => userMessage.includes(kw))) {
    bot.sendMessage(chatId, '🤔 It sounds like you might be looking for a service (like a plumber or electrician). Would you like to use our Search tool?', {
      reply_markup: {
        inline_keyboard: [[{ text: '🔍 Search for Services', callback_data: 'find_service' }]]
      }
    });
  }

  // Check if the message matches any triggers in the interaction dataset
  for (let category of Object.values(interactionDataset)) {
    for (let { trigger, response } of category) {
      if (trigger.some((word) => userMessage.includes(word))) {
        const randomResponse = response[Math.floor(Math.random() * response.length)];
        bot.sendMessage(chatId, randomResponse);
        return; // Stop after sending a response
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
