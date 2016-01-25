// Landing page rendering stuff 
var Tab = Parse.Object.extend("Tab")
var TabGroup = Parse.Object.extend("TabGroup")


module.exports.landing = function(req, res) {
  res.renderT('landing', {
    template: 'landing',
  })
}

module.exports.overview = function(req, res) {
  res.renderT('overview', {
    template: 'overview',
  })
}

module.exports.tabs = function(req, res) {
  var user = req.user
  var tabs = []  
   
//   Parse.Promise.as().then(function() {
//     var query = new Parse.Query(TabGroup)

//     query.equalTo("user", user)

//     return query.each(function(tabGroup) {
//       var group = new TabGroup()
//       group = tabGroup
      
//       var tabs = []
//       tabs = group.get("tabs")
//       if(tabs.length > 0) {
//         tabs.forEach(function(tab){
//           var tabToFetch = new Tab()
//           tabToFetch.id = tab
//           var tabQuery = new Parse.Query(Tab)
//           tabQuery.get("")
          
//         })
//       }
      
      
      
//       var data = {
//         id: tab.id,
//         title: tab.get("title"),
//         url: tab.get("url")
//       }

//       tabs.push(data)
      
//     })
//   }).then(function() {
//       res.renderT('tabs', {
//       template: 'tabs',
//       tabs: tabs
//     })
//   })
  
  
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
      tabs: tabs
    })
  })

}

module.exports.notFound = function(req, res) {
  res.redirect("/")
}