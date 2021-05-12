const router = require('express').Router();
const services = require('./services');

router.post('/logins',services.login);
router.post('/signups',services.signup);

module.exports=router;