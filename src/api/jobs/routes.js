const express = require('express');
const JobsHandler = require('./handler');
const { verifyToken } = require('../../middleware/auth');

const router = express.Router();
const handler = new JobsHandler();

// Public endpoints
router.get('/', (req, res, next) => handler.getJobsHandler(req, res, next));
router.get('/:id', (req, res, next) => handler.getJobByIdHandler(req, res, next));
router.get('/company/:companyId', (req, res, next) => handler.getJobsByCompanyIdHandler(req, res, next));
router.get('/category/:categoryId', (req, res, next) => handler.getJobsByCategoryIdHandler(req, res, next));

// Protected endpoints
router.post('/', verifyToken, (req, res, next) => handler.postJobHandler(req, res, next));
router.put('/:id', verifyToken, (req, res, next) => handler.putJobHandler(req, res, next));
router.delete('/:id', verifyToken, (req, res, next) => handler.deleteJobHandler(req, res, next));

// Bookmark routes
// POST /jobs/:jobId/bookmark
router.post('/:jobId/bookmark', verifyToken, (req, res, next) => handler.postBookmarkHandler(req, res, next));
// GET /jobs/:jobId/bookmark/:id
router.get('/:jobId/bookmark/:id', verifyToken, (req, res, next) => handler.getBookmarkByIdHandler(req, res, next));
// DELETE /jobs/:jobId/bookmark
router.delete('/:jobId/bookmark', verifyToken, (req, res, next) => handler.deleteBookmarkHandler(req, res, next));


module.exports = router;
