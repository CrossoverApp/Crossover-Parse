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

module.exports.account = function(req, res) {
  console.log("Account TAB GROUPS:  "+req.tabGroups)
  res.renderT('account', {
    template: 'account',
    tabGroups: req.tabGroups,
    email: req.email
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
  var tabsInGroup = []
  var groupId = req.params.tabGroup 
  var groupName = ""
  var tabGroups = req.tabGroups
  
  console.log("@@@@@  Group ID:  "+groupId)
  
    var query = new Parse.Query(TabGroup)    
    query.get(groupId, {
      success: function(result) {
        var tabGroup = new TabGroup()
        tabGroup = result
        console.log("TAB GROUP FOUND:  "+tabGroup.get("title"))
        groupName = tabGroup.get("title")
        
        tabsInGroup = tabGroup.get("tabs")
        
      }, error: function(object, error) {
        console.log("@@@@@@@     ERROR:  "+error)
      }
    }).then(function(){
      if(tabsInGroup < 1) {
          return res.renderT('tabs', {
            template: 'tabs',
            tabs: tabs,
            tabGroups: tabGroups,
            groupName: groupName

          })
      }
      
      return Parse.Promise.when( tabsInGroup.map(function(tab) {
        var tabQuery = new Parse.Query(Tab)
        console.log("TAB ID:  " + tab)
        return tabQuery.get(tab, {
          success: function(tab) {
            console.log("TAB TITLE:  "+tab.get("title"))
            var data = {
              id: tab.id,
              title: tab.get("title"),
              url: tab.get("url")
            }

            tabs.push(data)
          }, error: function(object, error) {
            console.log("ERROR:  "+error)
          }
        })
      })).then(function() {
          res.renderT('tabs', {
            template: 'tabs',
            tabs: tabs,
            tabGroups: tabGroups,
            groupName: groupName

          })
        })
    })

}


module.exports.notFound = function(req, res) {
  res.redirect("/")
}