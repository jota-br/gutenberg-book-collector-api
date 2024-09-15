const express = require('express');

const { authenticateToken } = require('../../security/token.middleware');

const gutenbergRouter = express.Router(); // CREATE ROUTER

const { gutenbergParser } = require('../../data/gutenberg.collector');

gutenbergRouter.use(authenticateToken);

gutenbergRouter.get('/', gutenbergParser);

module.exports = gutenbergRouter;