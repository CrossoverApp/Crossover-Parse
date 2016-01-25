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