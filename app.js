const express = require('express');
const morgan = require('morgan');

const userRouter = require('./routes/userRouter');
const tourRouter = require('./routes/tourRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(404, `Cant find ${req.originalUrl}`));
});

app.use(globalErrorHandler);

module.exports = app;
