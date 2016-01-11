//  Login stuff

module.exports.login = function(req, res) {
  res.renderT('login', {
    template: 'login',
  })
}