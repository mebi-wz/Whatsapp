const contactService = require('../services/contactService');

// Controller to handle contact creation
const createContact = async (req, res) => {
  const { phone_number, chat_id } = req.body;

  if (!phone_number || !chat_id) {
    return res.status(400).json({ message: 'Phone number and Chat ID are required.' });
  }

  try {
    const contact = await contactService.createContact(phone_number, chat_id);
    if(contact.success===false){
        res.status(200).json({ message: 'You Already Registered.',contact });
    }
    else
    res.status(201).json({ message: 'Contact created successfully.', contact });
  } catch (error) {
    console.error('Error in contactController:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = {
  createContact,
};
