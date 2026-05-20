const express = require('express');
const ApplicationsHandler = require('./handler');
const { verifyToken } = require('../../middleware/auth');

const router = express.Router();
const handler = new ApplicationsHandler();

// Protected endpoints
router.post('/', verifyToken, (req, res, next) => handler.postApplicationHandler(req, res, next));
router.get('/', verifyToken, (req, res, next) => handler.getApplicationsHandler(req, res, next));
router.get('/:id', verifyToken, (req, res, next) => handler.getApplicationByIdHandler(req, res, next));
router.get('/user/:userId', verifyToken, (req, res, next) => handler.getApplicationsByUserIdHandler(req, res, next));
router.get('/job/:jobId', verifyToken, (req, res, next) => handler.getApplicationsByJobIdHandler(req, res, next));
router.put('/:id', verifyToken, (req, res, next) => handler.putApplicationHandler(req, res, next));
router.delete('/:id', verifyToken, (req, res, next) => handler.deleteApplicationHandler(req, res, next));

module.exports = router;
