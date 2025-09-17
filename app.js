var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var createError = require('http-errors');
const connectDB = require('./config/db');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require("./routes/api");
var authRouter = require('./routes/auth');
const messagesRouter = require("./routes/messages");
const matchRequestRouter = require('./routes/matchRequest');
const matchRouter = require('./routes/match'); 
var app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://dating-app-eight-mu.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight requests

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/api", apiRouter);
app.use('/auth',authRouter );
app.use('/messages', messagesRouter);
app.use('/match-requests', matchRequestRouter);
app.use('/matches', matchRouter); 

connectDB().then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});


module.exports = app;
