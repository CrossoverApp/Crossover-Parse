// Landing page rendering stuff 
var Tab = Parse.Object.extend("Tab")
var TabGroup = Parse.Object.extend("TabGroup")

module.exports.landing = function(req, res) {
  res.renderT('landing', {
    template: 'landing',
  })
}

module.exports.overview = function(req, res) {
  console.log("OVERVIEW TAB GROUPS:  "+req.tabGroups)
  res.renderT('overview', {
    template: 'overview',
    tabGroups: req.tabGroups
  })
}

module.exports.tabs = function(req, res) {
  var user = req.user
  var tabs = []
  var tabGroups = req.tabGroups
  
  Parse.Promise.as().then(function() {
    var query = new Parse.Query(Tab)

    query.equalTo("user", user)

    return query.each(function(tab) {
      var data = {
        id: tab.id,
        title: tab.get("title"),
        url: tab.get("url")
      }

      tabs.push(data)
      
    })
  }).then(function() {
      res.renderT('tabs', {
      template: 'tabs',
      tabs: tabs,
      tabGroups: tabGroups
    })
  })

}

module.exports.notFound = function(req, res) {
  res.redirect("/")
}