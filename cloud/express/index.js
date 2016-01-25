var express = require('express')
var app = express()
 
// Set Master Key
Parse.Cloud.useMasterKey()

/*  **** FIX ROUTES ****  */

// Routes
  var routes = {
    index: require("cloud/express/routes/index.js"),
    accounts: require("cloud/express/routes/accounts.js"),
    tabs: require("cloud/express/routes/tabs.js"),
    tabGroups: require("cloud/express/routes/tabGroups.js")
  }

// Global app configuration section
app.set('views', 'cloud/express/views')
app.set('view engine', 'ejs')
app.enable('trust proxy')
 
// Configure express routes
app.use(express.bodyParser())
app.use(express.cookieParser())
app.use(express.cookieSession({
  secret: 'ursid',
  cookie: {
      httpOnly: true
  }
}))

app.use(function(req, res, next) {
  res.successT = function(data) {
    data = data || {}
    data.success = true
    res.json(data)
  }

  res.errorT = function(error) {
    error = error.description || error

    res.json({
      success: false,
      status: 1,
      message: error
    })
  }

  res.renderT = function(template, data) {
    data = data || {}
    data.host = req.protocol + "://" + req.host
    data.url = data.host + req.url
    data.template = data.template || template
    data.user = data.user || req.session.user
    data.random = Math.random().toString(36).slice(2)
    res.render(template, data)
  }

  next()
})

/* **** FIX LANDINGS AND FUNCTION ROUTES **** */ 

// Landings
app.get('/', routes.index.landing)
app.get('/tabs', routes.accounts.auth, routes.index.tabs)
app.get('/overview', routes.accounts.auth, routes.index.overview)
app.get('/login', routes.accounts.login)
app.get('/register', routes.accounts.register)

// Tab Groups
app.get('/tabs/:tabGroup', routes.accounts.auth, routes.index.tabs)

// Non-landing GET requests
app.get('/logout', routes.accounts.logout)
app.get('/getTabs', routes.accounts.auth, routes.tabs.getTabs)
// getting tabs
// getting tab groups


// Post Handling
app.post('/newUser', routes.accounts.newUser)
app.post('/user', routes.accounts.user)
app.post('/newTabs', routes.accounts.auth, routes.tabs.newTabs)
app.post('/deleteTabs', routes.accounts.auth, routes.tabs.deleteTabs)

app.post('/newTabGroup', routes.accounts.auth, routes.tabGroups.newTabGroup)

// creating tab groups
// creating tabs



// Not Found Redirect
// app.all("*", routes.index.notFound)
 
// Listen to Parse
app.listen()
