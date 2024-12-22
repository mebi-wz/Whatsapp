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

module.exports = {
  createContact,
};
