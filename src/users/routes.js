// const express = require('express');
const router = require('express').Router();
const services = require('./services');

router.post('/', services.users);

/**
 * @swagger
 * definitions:
 *   Users:
 *     properties:
 *       name:
 *         type: string
 *       breed:
 *         type: string
 *       age:
 *         type: integer
 *       sex:
 *         type: string
 */


router.get('/',services.fetchusers);
router.get('/:id',services.user);
router.put('/:id',services.updateUser);

module.exports = router;

// const app = express();
