// Landing page rendering stuff 

module.exports.landing = function(req, res) {
  res.renderT('landing', {
    template: 'landing',
  })
}

module.exports.notFound = function(req, res) {
  res.redirect("/")
}