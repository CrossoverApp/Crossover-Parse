// Landing page rendering stuff 
var Tab = Parse.Object.extend("Tab")


module.exports.landing = function(req, res) {
  res.renderT('landing', {
    template: 'landing',
  })
}

module.exports.tabs = function(req, res) {
  var user = req.user
  var tabs = []  
    
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
      res.renderT('account', {
      template: 'account',
      tabs: tabs
    })
  })
  
  

}

module.exports.notFound = function(req, res) {
  res.redirect("/")
}