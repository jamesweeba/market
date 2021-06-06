// const express = require('express');
const router = require('express').Router();
const services = require('./services');


router.post('/', services.users);
router.get('/',services.fetchusers);
router.get('/:id',services.user);
router.put('/:id',services.updateUser);

module.exports = router;

// const app = express();
