var Tab = Parse.Object.extend("Tab")
var TabGroup = Parse.Object.extend("TabGroup")
var User = Parse.User

module.exports.newTabs = function(req, res) {
  var groupId = ""
  var newTabs = []
  var tabTitles = []
  var tabUrls = []
  
  var user = new User()
  user.id = req.session.user
  
  newTabs = req.param("newTabs")
  groupId = req.param("tabGroup")
      
  if(newTabs) {
    var tabGroup = new TabGroup()
    tabGroup.id = groupId
    tabGroup.fetch({
      success: function() {
        if(newTabs) {
          return Parse.Promise.when(
            newTabs.map(function(newTab) {
              var tab = new Tab()
              tab.set("url", newTab.url)
              tab.set("title", newTab.title)
              tab.set("user", user)
              return tab.save({
                success: function(tab) {
                  console.log("NEW TAB SAVED:  "+tab.get("title"))
                  tabGroup.add("tabs", tab.id)
                  tabGroup.save()
                }, error: function() {
                  res.errorT()
                }
              })
            })
          ).then(function(){
            res.successT()
          })
 
        }
      }, error: function() {
        res.errorT()
      }
    })
    
    
  } else {
    res.errorT()
  }
  
}

module.exports.deleteTabs = function(req, res) {
  var deletedTabs = []
  deletedTabs = req.param("deleted")
  
  var query = new Parse.Query(Tab)
  query.containedIn("objectId", deletedTabs).find().then( function(tabs) {
    tabs.forEach(function(tab) {
      tab.destroy({
        success: function() {
          res.successT()
        }, 
        error: function() {
          res.errorT()
        }
      })
    })
    
  })
    
}


module.exports.getTabs = function(req, res) {
  var user = new User()
  var tabs = []

  user.id = req.session.user

  console.log("ID:  " + user.id);

  var query = new Parse.Query(Tab)

  query.equalTo("user", user)

  query.find().then(function(result) {
    if (result.length < 1) console.log("Query failed")
    result.forEach(function(tab) {

      console.log(tab.toString)

      var data = {
        id: tab.id,
        title: tab.get("title"),
        url: tab.get("url")
      }

      tabs.push(data)

    })
  }).then(function() {
    res.successT({
      tabs: tabs
    })
  })

}