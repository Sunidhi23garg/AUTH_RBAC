// const express = require('express');
// const createHttpError = require('http-errors');
// const morgan = require('morgan');
// const mongoose = require('mongoose');
// require('dotenv').config();
// const session = require('express-session');
// const connectFlash = require('connect-flash');
// const passport = require('passport');
// const connectMongo = require('connect-mongo');
// const { ensureLoggedIn } = require('connect-ensure-login');
// const { roles } = require('./utils/constants');
// // const MongoStore = connectMongo(session);

// // Initialization
// const app = express();
// app.use(morgan('dev'));
// app.set('view engine', 'ejs');
// app.use(express.static('public'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// const MongoStore = connectMongo(session);
// // Init Session
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       // secure: true,
//       httpOnly: true,
//     },
//     store: new MongoStore({ mongooseConnection: mongoose.connection }),
//   })
// );


// // For Passport JS Authentication
// app.use(passport.initialize());
// app.use(passport.session());
// require('./utils/passport.auth');

// app.use((req, res, next) => {
//   res.locals.user = req.user;
//   next();
// });

// // Connect Flash
// app.use(connectFlash());
// app.use((req, res, next) => {
//   res.locals.messages = req.flash();
//   next();
// });

// // Routes
// app.use('/', require('./routes/index.route'));
// app.use('/auth', require('./routes/auth.route'));
// app.use(
//   '/user',
//   ensureLoggedIn({ redirectTo: '/auth/login' }),
//   require('./routes/user.route')
// );
// app.use(
//   '/admin',
//   ensureLoggedIn({ redirectTo: '/auth/login' }),
//   ensureAdmin,
//   require('./routes/admin.route')
// );

// // 404 Handler
// app.use((req, res, next) => {
//   next(createHttpError.NotFound());
// });

// // Error Handler
// // app.use((error, req, res, next) => {
// //   error.status = error.status || 500;
// //   res.status(error.status);
// //   res.render('error_40x', { error });
// // });








// // Error Handler
// // app.use((error, req, res, next) => {
// //   error.status = error.status || 500;
// //   res.locals.user = req.user || null;  // Ensure user is always available
// //   res.status(error.status);
// //   res.render('error_40x', { error });
// // });


// app.use((error, req, res, next) => {
//   error.status = error.status || 500;
//   res.locals.user = req.user || null;  // Ensure user is always available
//   res.locals.messages = req.flash();  // Make sure messages are available in the error page
//   res.status(error.status);
//   res.render('error_40x', { error });
// });
















// // Setting the PORT
// const PORT = process.env.PORT || 3000;

// // Making a connection to MongoDB
// // mongoose
// //   .connect(process.env.MONGODB_URI, {
// //     dbName: process.env.DB_NAME,
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// //     useCreateIndex: true,
// //     useFindAndModify: false,
// //   })
// //   .then(() => {
// //     console.log('💾 connected...');
// //     // Listening for connections on the defined PORT
// //     app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
// //   })
// //   .catch((err) => console.log(err.message));





// // Making a connection to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     dbName: process.env.DB_NAME,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     // Removed useCreateIndex and useFindAndModify as they are no longer needed in Mongoose 6+
//   })
//   .then(() => {
//     console.log('💾 connected...');
//     // Listening for connections on the defined PORT
//     app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
//   })
//   .catch((err) => console.log(err.message));













// // function ensureAuthenticated(req, res, next) {
// //   if (req.isAuthenticated()) {
// //     next();
// //   } else {
// //     res.redirect('/auth/login');
// //   }
// // }













// // function ensureAdmin(req, res, next) {
// //   if (req.user.role === roles.admin) {
// //     next();
// //   } else {
// //     req.flash('warning', 'you are not Authorized to see this route');
// //     res.redirect('/');
// //   }
// // }

// // function ensureModerator(req, res, next) {
// //   if (req.user.role === roles.moderator) {
// //     next();
// //   } else {
// //     req.flash('warning', 'you are not Authorized to see this route');
// //     res.redirect('/');
// //   }
// // }












// function ensureAdmin(req, res, next) {
//   if (req.user && req.user.role === roles.admin) {
//     next();
//   } else {
//     req.flash('warning', 'You are not authorized to see this route');
//     res.redirect('/');
//   }
// }

// function ensureModerator(req, res, next) {
//   if (req.user && req.user.role === roles.moderator) {
//     next();
//   } else {
//     req.flash('warning', 'You are not authorized to see this route');
//     res.redirect('/');
//   }
// }



const express = require('express');
const createHttpError = require('http-errors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const session = require('express-session');
const connectFlash = require('connect-flash');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const { ensureLoggedIn } = require('connect-ensure-login');
const { roles } = require('./utils/constants');

// Initialization
const app = express();
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session Middleware (important for connect-flash)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Secure in production
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      dbName: process.env.DB_NAME,
    }),
  })
);

// Connect Flash Middleware (must come after session)
app.use(connectFlash());

// Passport Initialization
app.use(passport.initialize());
app.use(passport.session());
require('./utils/passport.auth');

// Global Variables
app.use((req, res, next) => {
  res.locals.user = req.user || null; // Make user available in all views
  res.locals.messages = req.flash(); // Make flash messages available
  next();
});

// Routes
app.use('/', require('./routes/index.route'));
app.use('/auth', require('./routes/auth.route'));
app.use(
  '/user',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  require('./routes/user.route')
);
app.use(
  '/admin',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureAdmin,
  require('./routes/admin.route')
);

// 404 Handler
app.use((req, res, next) => {
  next(createHttpError.NotFound());
});

// Error Handler
app.use((error, req, res, next) => {
  error.status = error.status || 500;
  res.locals.user = req.user || null; // Ensure user is always available
  res.locals.messages = req.flash(); // Ensure flash messages are available
  res.status(error.status);
  res.render('error_40x', { error });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('💾 Connected to MongoDB');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  })
  .catch((err) => console.error('Error connecting to MongoDB:', err.message));

// Role Middleware
function ensureAdmin(req, res, next) {
  if (req.user && req.user.role === roles.admin) {
    next();
  } else {
    req.flash('warning', 'You are not authorized to see this route');
    res.redirect('/');
  }
}

function ensureModerator(req, res, next) {
  if (req.user && req.user.role === roles.moderator) {
    next();
  } else {
    req.flash('warning', 'You are not authorized to see this route');
    res.redirect('/');
  }
}
