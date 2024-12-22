const { models } = require('../models/index');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Telegram bot setup
const token = process.env.TELEGRAM_BOT_TOKEN; // Bot token from .env file
const bot = new TelegramBot(token, { polling: false });

/**
 * Send message to all users in the database.
 * @param {string} phone_number
 * @param {string} message - The message to send.
 */

const sendMessageForSingleUser = async (phone_number, message) => {
    try {
        console.log();
      // Find the user by phone number
      const user = await models.usercontacts.findOne({ where: { phone_number } });
    console.log("users",user);
      if (!user) {
        throw new Error('User not found');
      }
  
      // Send the message to the user's chat_id
      await bot.sendMessage(user.chat_id, message);
  
      console.log(`Message sent to ${phone_number} (Chat ID: ${user.chat_id})`);
  
      return { status: 'success', message: `Message sent successfully to ${phone_number}.` };
    } catch (error) {
      console.error('Error in sendMessageToSpecificUser:', error);
      throw error;
    }
  };
const sendMessageToUsers = async (message) => {
  try {
    // Fetch all users from the database
    const users = await models.usercontacts.findAll();

    if (users.length === 0) {
      throw new Error('No users found in the database.');
    }

    // Send messages to all users
    const sendMessagePromises = users.map(async (user) => {
      try {
        await bot.sendMessage(user.chat_id, message);
        console.log(`Message sent to ${user.phone_number} (Chat ID: ${user.chat_id})`);
      } catch (err) {
        console.error(`Failed to send message to ${user.phone_number}:`, err.message);
      }
    });

    // Wait for all messages to be sent
    await Promise.all(sendMessagePromises);

    return { status: 'success', message: 'Messages sent successfully to all users.' };
  } catch (error) {
    console.error('Error in sendMessageToUsers:', error);
    throw error;
  }
};

module.exports = { sendMessageToUsers,sendMessageForSingleUser };
