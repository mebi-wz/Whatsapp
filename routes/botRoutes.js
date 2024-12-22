const express = require('express');
const contactController = require('../controllers/contactController');
const messageController=require('./../controllers/messageController');
const router = express.Router();

router.post('/contacts', contactController.createContact);
router.post('/message', messageController.sendMessage);
router.post('/messageForSingleUser', messageController.sendMessageToUser);
module.exports = router;
