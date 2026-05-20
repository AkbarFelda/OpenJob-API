const express = require('express');
const ProfileHandler = require('./handler');
const { verifyToken } = require('../../middleware/auth');

const router = express.Router();
const handler = new ProfileHandler();

// Protected endpoints
router.get('/', verifyToken, (req, res, next) => handler.getProfileHandler(req, res, next));
router.get('/applications', verifyToken, (req, res, next) => handler.getProfileApplicationsHandler(req, res, next));
router.get('/bookmarks', verifyToken, (req, res, next) => handler.getProfileBookmarksHandler(req, res, next));

module.exports = router;
