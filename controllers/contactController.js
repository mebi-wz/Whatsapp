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

const getLeaveBalance = async (req, res) => {
  const { chatId } = req.params;
  try {
    const contact = await contactService.getContactByChatId(chatId);
    if (!contact) {
      return res.status(404).json({ message: 'User not found' });
    }
    // real data fetch logic would go here
    return res.status(404).json({ message: 'No employee data found' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leave balance', error: error.message });
  }
};

const getAssets = async (req, res) => {
  const { chatId } = req.params;
  try {
    const contact = await contactService.getContactByChatId(chatId);
    if (!contact) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(404).json({ message: 'No employee data found' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assets', error: error.message });
  }
};

const getColleaguesOnLeave = async (req, res) => {
  const { chatId } = req.params;
  try {
    const contact = await contactService.getContactByChatId(chatId);
    if (!contact) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(404).json({ message: 'No employee data found' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching colleagues on leave', error: error.message });
  }
};

const updateRole = async (req, res) => {
  const { chat_id, role } = req.body;
  try {
    const contact = await contactService.updateUserRole(chat_id, role);
    if (!contact) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Role updated successfully', contact });
  } catch (error) {
    res.status(500).json({ message: 'Error updating role', error: error.message });
  }
};

const updateCategory = async (req, res) => {
  const { chat_id, category } = req.body;
  try {
    const contact = await contactService.updateUserCategory(chat_id, category);
    if (!contact) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Category updated successfully', contact });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

const getProvidersByCategory = async (req, res) => {
  const { category } = req.params;
  const { location } = req.query;
  try {
    const providers = await contactService.getProvidersByCategory(category, location);
    res.status(200).json({ providers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching providers', error: error.message });
  }
};

const updateLocation = async (req, res) => {
  const { chat_id, location } = req.body;
  try {
    const contact = await contactService.updateUserLocation(chat_id, location);
    if (!contact) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Location updated successfully', contact });
  } catch (error) {
    res.status(500).json({ message: 'Error updating location', error: error.message });
  }
};

const updateServiceDetails = async (req, res) => {
  const { chat_id, service_details } = req.body;
  try {
    const contact = await contactService.updateUserServiceDetails(chat_id, service_details);
    if (!contact) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Service details updated successfully', contact });
  } catch (error) {
    res.status(500).json({ message: 'Error updating service details', error: error.message });
  }
};

module.exports = {
  createContact,
  getLeaveBalance,
  getAssets,
  getColleaguesOnLeave,
  updateRole,
  updateCategory,
  getProvidersByCategory,
  updateLocation,
  updateServiceDetails
};
