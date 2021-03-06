//  Login stuff
var User = Parse.User
var TabGroup = Parse.Object.extend("TabGroup")

module.exports.auth = function(req, res, next) {
  if(req.session.user) {
		var user = new User()
    user.id = req.session.user

    user.fetch().then(function() {
      req.user = user
      next()
    })
	} else if(req.xhr) {
		res.errorT("Login required")
	} else {
		res.renderT("login")
	}
}


module.exports.login = function(req, res) {
	if(req.session.user) {
		res.redirect('/overview')
	} else {
		res.renderT('login', {
    	template: 'login',
  	})
	}
  
}

module.exports.register = function(req, res) {
  res.renderT('register', {
    template: 'register',
  })
}




module.exports.user = function(req, res) {
  Parse.User.logIn(
    req.param("email"), req.param("password")
  ).then(function(user) {
    req.session.user = user.id
    res.successT({
			currentUser: user
		})
  }, function() {
    res.errorT("Invalid Credentials")
  })
}


module.exports.email = function(req, res, next) {
  req.email = req.user.get('email')
  next()
}




module.exports.changePass = function(req, res) {
  req.user.set("password", req.param("passwordNew"))
  
  req.user.save({
    success: function() {
        // send success object back
        res.successT()
    }, error: function(error) {
        res.errorT({
          message: error.message
        })
    }
})
  

}







module.exports.changeEmail = function(req, res) {
  req.user.set("username", req.param("emailNew"))
  req.user.set("email", req.param("emailNew"))
  
  req.user.save({
    success: function() {
        // send success object back
        res.successT()
    }, error: function(error) {
        res.errorT({
          message: error.message
        })
    }
})
  

}




module.exports.newUser = function(req, res) {
  var user = new Parse.User()
  user.set("username", req.param("email"))
  user.set("email", req.param("email"))
  user.set("password", req.param("password"))
  
  user.signUp(null, {
    success: function(user) {
			var defaultTabGroup = new TabGroup()
			defaultTabGroup.set("user", user)
			defaultTabGroup.set("canDelete", false)
			defaultTabGroup.set("title", "Home Group")
			defaultTabGroup.set("tabs", [])
			defaultTabGroup.save()
			
      res.successT()
    }, 
    
    error: function(user, error) {
      res.errorT("Error creating user")
    }
    
  })
  
}

module.exports.logout = function(req, res) {
  console.log(1)
  Parse.User.logOut()
  req.session = null
  res.redirect("/")
}


