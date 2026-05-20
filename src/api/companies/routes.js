const express = require('express');
const CompaniesHandler = require('./handler');
const { verifyToken } = require('../../middleware/auth');

const router = express.Router();
const handler = new CompaniesHandler();

// Public endpoints
router.get('/', (req, res, next) => handler.getCompaniesHandler(req, res, next));
router.get('/:id', (req, res, next) => handler.getCompanyByIdHandler(req, res, next));

// Protected endpoints
router.post('/', verifyToken, (req, res, next) => handler.postCompanyHandler(req, res, next));
router.put('/:id', verifyToken, (req, res, next) => handler.putCompanyHandler(req, res, next));
router.delete('/:id', verifyToken, (req, res, next) => handler.deleteCompanyHandler(req, res, next));

module.exports = router;
