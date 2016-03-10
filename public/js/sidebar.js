$(document).ready(function(){
  
  var ids = $("#tabGroupList").children(".notifications").map(function(){
    return {id: $(this).attr("id"), title: $(this).attr("name")}
  })
  
  var html = ""

  for (var i = 0; i < ids.length; i++) {
    var obj = ids[i];
    html+= "<option id=\""+obj.id+"\" value=\""+obj.title+"\">"+obj.title+"</option>"
  }
  
    //New Tab Group Button
  $("#newTabGroupButton").click(function () {
		var tabTitle = ""
    swal({
      title: "New Tab Group",
      text: "Please enter a name for your new tab group:",
			html: '<p style="padding-bottom: 20px">Enter a name for your new Tab Group: </p> <p><input id="input-field" style="margin: 10px; padding: 5px; font-size: 20px;"></p>',
      showCancelButton: true,
      closeOnConfirm: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      inputPlaceholder: "Write something",
      showLoaderonConfirm: true
    }, function() {
      if ($('#input-field').val() === false) return false;
      if ($('#input-field').val() === "") {
        swal(   'Woops!',   'You need to enter something!',   'error' )
        return false
      }
			tabTitle = $('#input-field').val()
      $.post('/newTabGroup', {
        title: $('#input-field').val()
      }, function(response){
        if(response.success) {
          swal({
            title: 'Nice!',
            text: "Your new group, \"" + tabTitle+"\", was created!",
            type: 'success'
          }, function() {
            location.reload()
          });
        } else {
          swal("Oh no!", "We were unable to create your new Tab group. Please try again.", "error")
        }
      })
      
      
    })
  })

  //Delete Tab Group
$("#deleteTabGroupButton").click(function () {
       swal({
            title: 'Delete Tab Group',
            html:'<form>'
            + '<select id = "tabGROUP">'
            + html
            + '</select>'
            + '</form>',
            showCancelButton: true,
            closeOnConfirm: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            showLoaderonConfirm: true
          },
           function() {
            // enter something here...
          });
});
  
  
})