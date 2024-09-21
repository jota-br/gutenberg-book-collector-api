const express = require('express');

const gutenbergRouter = express.Router(); // CREATE ROUTER
const { gutenbergParser } = require('../data/gutenberg.collector');
const { adminOnly } = require('../security/access');

gutenbergRouter.get('/', adminOnly, gutenbergParser);

module.exports = gutenbergRouter;