$(document).ready(function() {
  
  var i = $('tbody tr').length - 1;
  
  $("#add_row").click(function() {
    $('#addr' + i).html("<td>" + (i + 1) + "</td><td><input name='title' type='text' placeholder='Title' class='form-control input-md'  /> </td><td><input  name='url' type='text' placeholder='URL'  class='form-control input-md'></td>");

    $('#tab_logic').append('<tr id="addr' + (i + 1) + '" name="new"></tr>');
    i++;
  });
  
  $("#delete_row").click(function() {
    var deleted = []
    
    if (i > 1) {
      $("#addr" + (i - 1)).html('');
      
      deleted.push($("#addr"+(i-1)).attr("name"))
      
      $("#addr"+(i-1)).attr("name", "")
      i--;
      
      $.post('/deleteTabs', {
        deleted: deleted
      },function(response){
        
        console.log("successfully deleted")
      })
      
    }
  });
  
  $("#save_rows").click(function() {    
    var newTabs = []
    
    $("tr[name]").each(function() {
      
      if($(this).attr("name") == "new" && $(this).children().length > 0 ) {
        
        var title = $(this).find("[name=title]").val()
        var url = $(this).find("[name=url]").val()
                
        if(title && url) {
          
          console.log("new tab: ")
          console.log("Title:  "+title+"     URL:  "+url)
          
          var tab = {
            title: title,
            url: url
          }
          
          newTabs.push(tab)
          
        } else {
          console.log("Null tab")
        }
     
      }      
      
    })
       
    if(newTabs.length > 0)
      $.post('/newTabs', {
        newTabs: newTabs,
      }, function(response) {
        if(response.success) {
          console.log("successful save")
        } else {
          console.log("error saving")
          console.log(response.error)
        }
      })
  
  })
  
  $("#logout_button").click(function() {
    window.location.href = "/logout"
  })

});