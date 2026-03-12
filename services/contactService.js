const { models } = require('../models/index');

// Service for creating a contact
const createContact = async (phoneNumber, chatId) => {
  try {
    let contact=[]
    const isContactExists=await models.usercontacts.findAll({ where: {chat_id:chatId.toString()}})
    if(isContactExists.length>0){
        contact=isContactExists;
        return {success:false,contact};
    }
     contact = await models.usercontacts.create({
      phone_number: phoneNumber,
      chat_id: chatId,
    });
    return {success:true,contact};
  } catch (error) {
    throw new Error('Error creating contact: ' + error.message);
  }
};

const getContactByChatId = async (chatId) => {
  try {
    const contact = await models.usercontacts.findOne({ where: { chat_id: chatId.toString() } });
    return contact;
  } catch (error) {
    throw new Error('Error fetching contact: ' + error.message);
  }
};

const updateUserRole = async (chatId, role) => {
  try {
    const contact = await models.usercontacts.findOne({ where: { chat_id: chatId.toString() } });
    if (contact) {
      contact.role = role;
      await contact.save();
    }
    return contact;
  } catch (error) {
    throw new Error('Error updating role: ' + error.message);
  }
};

const updateUserCategory = async (chatId, category) => {
  try {
    const contact = await models.usercontacts.findOne({ where: { chat_id: chatId.toString() } });
    if (contact) {
      contact.category = category;
      await contact.save();
    }
    return contact;
  } catch (error) {
    throw new Error('Error updating category: ' + error.message);
  }
};

const getProvidersByCategory = async (category, location) => {
  try {
    const whereClause = {
      role: 'provider',
      category: category
    };
    if (location) {
      whereClause.location = location;
    }
    const providers = await models.usercontacts.findAll({
      where: whereClause
    });
    return providers;
  } catch (error) {
    throw new Error('Error fetching providers: ' + error.message);
  }
};

const updateUserLocation = async (chatId, location) => {
  try {
    const contact = await models.usercontacts.findOne({ where: { chat_id: chatId.toString() } });
    if (contact) {
      contact.location = location;
      await contact.save();
    }
    return contact;
  } catch (error) {
    throw new Error('Error updating location: ' + error.message);
  }
};

const updateUserServiceDetails = async (chatId, details) => {
  try {
    const contact = await models.usercontacts.findOne({ where: { chat_id: chatId.toString() } });
    if (contact) {
      contact.service_details = details;
      await contact.save();
    }
    return contact;
  } catch (error) {
    throw new Error('Error updating service details: ' + error.message);
  }
};

module.exports = {
  createContact,
  getContactByChatId,
  updateUserRole,
  updateUserCategory,
  getProvidersByCategory,
  updateUserLocation,
  updateUserServiceDetails
};
