const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const globalErrorHandler = require('./controllers/errorController');
const app = express();
const uploadRouter = require('./routes/uploadFileRouter');
const accountRouter = require('./routes/accountRouter');
const cageRouter = require('./routes/cageRouter');
const componentRouter = require('./routes/componentRouter');
const imageRouter = require('./routes/imageRouter');
const customerRouter = require('./routes/customerRouter');
const cageComponentRouter = require('./routes/cageComponentRouter');
const orderRouter = require('./routes/orderRouter');
const orderDetailRouter = require('./routes/orderDetailRouter');
const AppError = require('./utils/appError');
const OrderDetail = require('./models/entity/orderDetail');
// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));

// Enable CORS
app.use(
  cors({
    origin: 'http://localhost:3000', //ENDPOINT FRONTEND
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTES
app.use('/api/v1/upload', uploadRouter);
app.use('/api/v1/account', accountRouter);
app.use('/api/v1/cage', cageRouter);
app.use('/api/v1/component', componentRouter);
app.use('/api/v1/image', imageRouter);
app.use('/api/v1/customer', customerRouter);
app.use('/api/v1/cageComponent', cageComponentRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/orderDetail', orderDetailRouter);
// 3) CACTH ALL ROUTES IF THE ROUTE IS NOT DEFINED
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
