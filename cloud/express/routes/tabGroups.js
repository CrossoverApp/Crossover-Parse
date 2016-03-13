var Tab = Parse.Object.extend("Tab")
var TabGroup = Parse.Object.extend("TabGroup")
var User = Parse.User

module.exports.newTabGroup = function(req, res) {
  var groupTitle = req.param("title")
  var user = req.user
  
  if(groupTitle) {
    var newTabGroup = new TabGroup()
    newTabGroup.set("user", user)
    newTabGroup.set("canDelete", true)
    newTabGroup.set("tabs", [])
    newTabGroup.set("title", groupTitle)
    newTabGroup.save({
        success: function() {
          res.successT()
        }, 
        error: function() {
          res.errorT()
        }
      })
  } else {
    res.errorT({
      message: "Error creating group"
    })
  }
  
}

module.exports.sidebarTabGroups = function(req, res, next) {
  var user = req.user
  var tabGroups = []
  
  var query = new Parse.Query(TabGroup)
  query.equalTo("user", user)
  query.find({
    success: function(results) {
      results.forEach(function(tabGroup) {
        var data = {
          id: tabGroup.id,
          title: tabGroup.get("title")
        }
        
        tabGroups.push(data)
        
      })
    }
  }).then(function(){
    req.tabGroups = tabGroups
    next()
  })
}

module.exports.getTabGroups = function(req, res) {
  var user = req.user
  var tabGroups = []
  
  var query = new Parse.Query(TabGroup)
  query.equalTo("user", user)
  query.find({
    success: function(results) {
      results.forEach(function(tabGroup) {
        var data = {
          id: tabGroup.id,
          title: tabGroup.get("title")
        }
        
        tabGroups.push(data)
        
      })
    }
  }).then(function(){
    res.successT({
      tabGroups: tabGroups
    })
  })
  
}

module.exports.getTabGroupTabs = function(req, res) {
  var user = req.user
  var groupId = ""
  var tabs = []
  
  groupId = req.param("tabGroup")
  
  var query = new Parse.Query(TabGroup)
  
  query.get(groupId).then(function(tabGroup) {
    var tabIds = tabGroup.get("tabs")
    
    return Parse.Promise.when(
        tabIds.map(function(tabId) {
          var tabQuery = new Parse.Query(Tab)
          return tabQuery.get(tabId, {
            success: function(tab) {
              var data = {
                id: tab.id,
                title: tab.get("title"),
                url: tab.get("url")
              }
              
              tabs.push(data)
            }
          })

        })
      )
    
  }).then(function() {
    res.successT({
      tabs: tabs
    })
  }) 
  
}


module.exports.deleteTabGroup = function(req, res) {
  var groupId = ""
  groupId = req.param("deleted")

  var tabGroup = new TabGroup()

  tabGroup.id = groupId
  tabGroup.fetch({
    success: function() {
      if (tabGroup.get("canDelete")) {
        var tabs = tabGroup.get("tabs")
        var query = new Parse.Query(TabGroup)

        query.containedIn("objectId", tabs).find().then(function(tabs) {
          return Parse.Promise.when(
            tabs.map(function(tab) {
              tab.destroy()
            })
          )
        }).then(function() {
          tabGroup.destroy()
        }).then(function() {
          res.successT()
        })
      } else {
        return false;
      }

    }, error: function(error) {
      res.errorT({
        message: error.message
      })
    }
  })
}