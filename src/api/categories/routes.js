const express = require('express');
const CategoriesHandler = require('./handler');
const { verifyToken } = require('../../middleware/auth');

const router = express.Router();
const handler = new CategoriesHandler();

// Public endpoints
router.get('/', (req, res, next) => handler.getCategoriesHandler(req, res, next));
router.get('/:id', (req, res, next) => handler.getCategoryByIdHandler(req, res, next));

// Protected endpoints
router.post('/', verifyToken, (req, res, next) => handler.postCategoryHandler(req, res, next));
router.put('/:id', verifyToken, (req, res, next) => handler.putCategoryHandler(req, res, next));
router.delete('/:id', verifyToken, (req, res, next) => handler.deleteCategoryHandler(req, res, next));

module.exports = router;
