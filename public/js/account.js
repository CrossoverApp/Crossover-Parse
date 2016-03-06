$(document).ready(function() {
  
  
     var buttonEnabled = true;

   
   
  
  
  
  
  $(".form-updateEmail").on("submit", function(event) {
    event.preventDefault()
    event.stopPropagation()
    		
    if(buttonEnabled) {
      var emailNew = $("#newest_email").val()
 
     
      var button = $("#submitEmail")
						
     // buttonEnabled = false;
       emailText("Sending...")
       button.prop("disabled", true)
     
     
     $.post('/changeEmail', {
           emailNew: emailNew
     }, function (response) {
           //alert("Your Email has been updated!")
           emailText("Your Email has been updated!")
       })
     
     
     
			
			
     }
     
   })
  
  
  $(".form-updatePass").on("submit", function(event) {
    event.preventDefault()
    event.stopPropagation()
    		
    if(buttonEnabled) {
      var email = $("#email_name").val()
      var password = $("#inputPassword").val()
      var passwordNew = $("#newPassword").val()
      var passwordConfirm = $("#confirmPassword").val()
     
      var button = $("#submitButton")
						
     // buttonEnabled = false;
      buttonText("Sending...")
			
			button.prop("disabled", true)
			
			if(passwordNew == passwordConfirm) {
			  console.log("same pass")
			  $.post("/user", {
					email: email,
					password: password
				}, function(response) {

					if(response.success) {
				           console.log("valid")
					   buttonText("Changing Pass...")
						 $.post('/changePass', {
                                                       passwordNew: passwordNew
                                                 }, function (response) {
                                                       buttonText("Your Password Has Been Changed!")
                                                 })
					}
					else{
					  console.log("invalid")
					  buttonEnabled = true
				          buttonText("Old password did not match one on record")
					  button.prop("disabled", false)
					}
                                  })

			
 			} else {
                                console.log("diff pass")
 				buttonText("Passwords do not match!")
 				buttonEnabled = true;
 				button.prop("disabled", false)
 				$("#newPassword, #confirmPassword").val("")
 			}
     }
     
   })
  
	
	$("#submitButton").on("blur", function(event) {
		$(this).text("Change Password!")
	})
	
	function buttonText(text) {
		$("#submitButton").text(text)
	}
  
 $("#submitEmail").on("blur", function(event) {
 		$(this).text("Change Email!")
 	})
 	
 	function emailText(text) {
 		$("#submitEmail").text(text)
 	}
   
     $("#logout_button").click(function() {
    window.location.href = "/logout"
  })
  
  
  });