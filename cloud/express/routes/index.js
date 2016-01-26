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
  var groupId = req.tabGroup 
  var tabGroups = req.tabGroups
  
  if(groupId) console.log("Group ID:  "+groupId)
  
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

module.exports.tabGroup = function(req, res) {
  var user = req.user
  var tabs = []
  var groupId = req.params.tabGroup 
  var tabGroups = req.tabGroups
  
  console.log("@@@@@  Group ID:  "+groupId)
  
  Parse.Promise.as().then(function() {
    var query = new Parse.Query(TabGroup)
    
    query.get(groupId, {
      success: function(tabGroup) {
        console.log("TAB GROUP FOUND:  "+tabGroup.get("title"))
        
        var tabsInGroup = []
        tabsInGroup = tabGroup.get("tabs")
        tabsInGroup.forEach(function(tab){
          query.get(tab.id, {
            success: function(tab){
              var data = {
                id: tab.id,
                title: tab.get("title"),
                url: tab.get("url")
              }
              
              tabs.push(data)
            }
          })
        })
        
      }, error: function(object, error) {
        console.log("@@@@@@@     ERROR:  "+error)
      }
    })

//     query.equalTo("user", user)

//     return query.each(function(tab) {
//       var data = {
//         id: tab.id,
//         title: tab.get("title"),
//         url: tab.get("url")
//       }

//       tabs.push(data)
      
//     })
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