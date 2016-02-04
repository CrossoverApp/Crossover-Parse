$(document).ready( function() {
  
  var buttonEnabled = true;
  
  $(".form-signin").on("submit", function(event) {
    event.preventDefault()
    event.stopPropagation()
    		
    if(buttonEnabled) {
      var email = $("#inputEmail").val()
      var password = $("#inputPassword").val()
			var button = $("#submitButton")
						
      buttonEnabled = false;
      buttonText("Sending...")
			
			button.prop("disabled", true)
						
      $.post("/user", {
        email: email,
        password: password
      }, function(response) {

        console.log(response)
        console.log(response.success)

        if(response.success) {
          buttonText("Logging in...")      
          window.location.href = "/overview"
        } else {
          buttonEnabled = true
          buttonText("Login failed")
          button.prop("disabled", false)
          $("#inputPassword").val("")
        }
      })

    }
    
  })
	
	$("#submitButton").on("blur", function(event) {
		$(this).text("Sign in")
	})
	
	function buttonText(text) {
		$("#submitButton").text(text)
	}
  
})