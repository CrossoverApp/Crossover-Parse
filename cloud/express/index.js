var express = require('express')
var app = express()
 
// Set Master Key
Parse.Cloud.useMasterKey()

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

// Landings
app.get('/', routes.index.landing)
// app.get('/tabs', routes.accounts.auth, routes.tabGroups.sidebarTabGroups, routes.index.tabs)
app.get('/overview', routes.accounts.auth, routes.tabGroups.sidebarTabGroups, routes.index.overview)
app.get('/account', routes.accounts.auth, routes.tabGroups.sidebarTabGroups, routes.accounts.email, routes.index.account)

app.get('/login', routes.accounts.login)
app.get('/register', routes.accounts.register)
app.get('/email', routes.accounts.auth, routes.accounts.email )



// Tab Groups
app.get('/tab/:tabGroup', routes.accounts.auth, routes.tabGroups.sidebarTabGroups, routes.index.tabGroup)

// Non-landing GET requests
app.get('/logout', routes.accounts.logout)

app.get('/getTabs', routes.accounts.auth, routes.tabs.getTabs)

app.get('/getTabGroups', routes.accounts.auth, routes.tabGroups.getTabGroups)
app.get('/getTabGroupTabs', routes.accounts.auth, routes.tabGroups.getTabGroupTabs)

// Post Handling
app.post('/newUser', routes.accounts.newUser)
app.post('/user', routes.accounts.user)

app.post('/newTabs', routes.accounts.auth, routes.tabs.newTabs)
app.post('/deleteTabs', routes.accounts.auth, routes.tabs.deleteTabs)

app.post('/newTabGroup', routes.accounts.auth, routes.tabGroups.newTabGroup)
app.post('/deleteTabGroup', routes.accounts.auth, routes.tabGroups.deleteTabGroup)

app.post('/changePass', routes.accounts.auth, routes.accounts.changePass )
app.post('/changeEmail', routes.accounts.auth, routes.accounts.changeEmail )




// Not Found Redirect
// app.all("*", routes.index.notFound)
 
// Listen to Parse
app.listen()
