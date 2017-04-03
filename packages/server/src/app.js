'use strict';

const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');

const authentication = require('feathers-authentication');
const local = require('feathers-authentication-local');
const jwt = require('feathers-authentication-jwt');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');

const app = feathers();

// Load app configuration
app.configure(configuration(path.join(__dirname, '..')));

// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));

// Host the public folder
app.use('/', feathers.static(app.get('public')));

// Set up plugins and providers
app.configure(hooks());
app.configure(rest());
app.configure(socketio());

// Set up authentication
app.configure(authentication(app.get('auth')));
app.configure(local());
app.configure(jwt());

// Set up our services (see `services/index.js`)
app.configure(services);

// Add the authentication hook
app.service('authentication').hooks({
  before: {
    create: [
      authentication.hooks.authenticate(['local', 'jwt'])
    ]
  }
});

// Configure middleware (see `middleware/index.js`) - always has to be last
app.configure(middleware);
app.hooks(appHooks);

module.exports = app;
