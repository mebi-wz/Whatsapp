const express = require('express');
const contactController = require('../controllers/contactController');
const messageController = require('./../controllers/messageController');
const router = express.Router();
router.get('/', (req, res) => {
    res.send('Telegram Bot!');
});
router.post('/contacts', contactController.createContact);
router.get('/leave-balance/:chatId', contactController.getLeaveBalance);
router.get('/assets/:chatId', contactController.getAssets);
router.get('/colleagues-on-leave/:chatId', contactController.getColleaguesOnLeave);
router.post('/update-role', contactController.updateRole);
router.post('/update-category', contactController.updateCategory);
router.post('/update-location', contactController.updateLocation);
router.post('/update-service-details', contactController.updateServiceDetails);
router.get('/providers/:category', contactController.getProvidersByCategory);
router.post('/message', messageController.sendMessage);
router.post('/messageForSingleUser', messageController.sendMessageToUser);
module.exports = router;
