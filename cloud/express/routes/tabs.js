var Tab = Parse.Object.extend("Tab")
var TabGroup = Parse.Object.extend("TabGroup")
var User = Parse.User

module.exports.newTabs = function(req, res) {
  var newTabs = []
  var oldTabs = []
  var tabTitles = []
  var tabUrls = []
  
  var user = new User()
  user.id = req.session.user
  
  newTabs = req.param("newTabs")
  oldTabs = req.param("oldTabs")
  
  console.log("$$$$$$$$$$$$$    OLD TABS:   "+oldTabs)
    
  if(newTabs) {
    if(newTabs) {
      newTabs.forEach(function(newTab) {
        var tab = new Tab()
        tab.set("url", newTab.url)
        tab.set("title", newTab.title)
        tab.set("user", user)
        tab.save()
      })
    }
    
    res.successT()
    
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