const express = require('express');
const AuthenticationsHandler = require('./handler');

const router = express.Router();
const handler = new AuthenticationsHandler();

router.post('/', (req, res, next) => handler.postAuthenticationHandler(req, res, next));
router.put('/', (req, res, next) => handler.putAuthenticationHandler(req, res, next));
router.delete('/', verifyToken, (req, res, next) => handler.deleteAuthenticationHandler(req, res, next));

module.exports = router;
