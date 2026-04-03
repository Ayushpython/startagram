const express = require('express');

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[${status}] ${message}`);

  res.status(status).json({
    error: message,
    status,
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;
