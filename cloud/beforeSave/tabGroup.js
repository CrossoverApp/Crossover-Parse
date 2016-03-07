Parse.Cloud.beforeSave("TabGroup", function(req, res) {
  var tabGroup = req.object;
  if(!tabGroup.get("tabs")) tabGroup.set("tabs", [])
  res.success()
})