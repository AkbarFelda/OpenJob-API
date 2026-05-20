const express = require('express');
const UsersHandler = require('./handler');

const router = express.Router();
const handler = new UsersHandler();

// Bind context to handler methods
router.post('/', (req, res, next) => handler.postUserHandler(req, res, next));
router.get('/:id', (req, res, next) => handler.getUserByIdHandler(req, res, next));

module.exports = router;
