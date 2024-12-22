const { sendMessageToUsers,sendMessageForSingleUser } = require('../services/messageService');

/**
 * Controller to handle sending messages to all users.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const sendMessage = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message content is required.' });
  }

  try {
    const result = await sendMessageToUsers(message);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
const sendMessageToUser = async (req, res) => {
    const { phone_number, message } = req.body;
  
    if (!phone_number || !message) {
      return res.status(400).json({ message: 'Phone number and message are required.' });
    }
  
    try {
      const result = await sendMessageForSingleUser(phone_number, message);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };
module.exports = { sendMessage,sendMessageToUser };
