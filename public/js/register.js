$(document).ready( function() {
  
  var buttonEnabled = true;
  
  $(".form-signin").on("submit", function(event) {
    event.preventDefault()
    event.stopPropagation()
    		
    if(buttonEnabled) {
      var email = $("#inputEmail").val()
      var password = $("#inputPassword").val()
			var passwordConfirm = $("#confirmPassword").val()
			var button = $("#submitButton")
						
      buttonEnabled = false;
      buttonText("Sending...")
			
			button.prop("disabled", true)
			
			if(password == passwordConfirm) {
			
				$.post("/newuser", {
					email: email,
					password: password
				}, function(response) {

					if(response.success) {
						buttonText("Logging in...")
					} else {
						buttonEnabled = true
						buttonText("Registration failed")
						button.prop("disabled", false)
						$("#inputPassword, #confirmPassword").val("")
					}
				})
			} else {
				buttonText("Passwords do not match!")
				buttonEnabled = true;
				button.prop("disabled", false)
				$("#inputPassword, #confirmPassword").val("")
			}
    }
    
  })
	
	$("#submitButton").on("blur", function(event) {
		$(this).text("Sign me up!")
	})
	
	function buttonText(text) {
		$("#submitButton").text(text)
	}
  
})