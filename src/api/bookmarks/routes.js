const express = require('express');
const BookmarksHandler = require('./handler');
const { verifyToken } = require('../../middleware/auth');

const router = express.Router();
const handler = new BookmarksHandler();

// GET /bookmarks -> Get all bookmarks for logged-in user
router.get('/', verifyToken, (req, res, next) => handler.getBookmarksHandler(req, res, next));

module.exports = router;
