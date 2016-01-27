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