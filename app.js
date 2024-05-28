const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');

const userRouter = require('./routes/userRouter');
const tourRouter = require('./routes/tourRouter');
const reviewRouter = require('./routes/reviewRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

const app = express();

app.use(helmet());
app.use(morgan('dev'));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
//middleware for preventing nosql query injection
app.use(mongoSanitize());

//middleware for preventing xss
app.use(xss());

//middleware for preventing parameter pollution
app.use(
  hpp({
    whitelist: ['duration'],
  })
);

app.use(compression());

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(404, `Cant find ${req.originalUrl}`));
});

app.use(globalErrorHandler);

module.exports = app;
