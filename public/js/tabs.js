$(document).ready(function() {
  var href = $(location).attr("href")
  var groupId = href.substr(href.lastIndexOf('/') + 1)
  var i = $('tbody tr').length - 1;
  var url = window.location.href;
  var limit = 1
  
  $("#add_row").click(function() {
    if(limit == 1){
    $('#addr' + i).html("<td>" + (i + 1) + "</td><td><input name='title' type='text' placeholder='Title' class='form-control input-md'  /> </td><td><input  name='url' type='text' placeholder='URL'  class='form-control input-md'></td>");

    $('#tab_logic').append('<tr id="addr' + (i + 1) + '" name="new"></tr>');
    i++;
    limit = 0
    }
    else{
     alert("Please save current row before adding more tabs");
    }
  });

  $("#open_rows").click(function() {
    if (i >= 1) {
     console.log("open all rows clicked");

      $("input[name=button]").each(function() {        
        window.open(/^(http|https):/.test($(this).val()) ? $(this).val() : 'http://' + $(this).val())
      })
    }
  });
  
  $(".button").click(function() {
            window.open(/^(http|https):/.test($(this).val()) ? $(this).val() : 'http://' + $(this).val())
console.log(($(this).val()));
    
  });
  
  
  
   $(".topmenu a").each(function() {
            // checks if its the same on the address bar
            if (url == (this.href)) {
                $(this).closest("li").addClass("active");
            }
        });






$("#open_selected_rows").click(function() {
    if (i >= 1) {
     console.log("open selected rows clicked");

   $("tr[name]").each(function() {
     var url = $(this).find("[name=button]").val()
     console.log(url);
     var check_b = $(this).find("[name=select]")
     	console.log(check_b);
	
	if (check_b.is(":checked")) {
	  console.log("this is checked, will open url");
	   window.open(/^(http|https):/.test(url) ? url : 'http://' + url)
	}
	

	  
	
    })
    }
    });

//This is where we move the tabs up and down
    $(".up,.down").click(function(){
        var row = $(this).parents("tr:first");
        if ($(this).is(".up")) {
            row.insertBefore(row.prev());
        } else {
            row.insertAfter(row.next());
        }
    });



//   $(".selectall").clic(function() {
//      $('input[name=select]').each(function() {
//     if ($(this).is(":checked")) {
//         // Iterate each checkbox
//         $(':checkbox').each(function() {
//             this.checked = true;                        
//         })
//     }
// 			     })
// });
  
 $('.selectall').click(function(event) {
        var $that = $(this);
        $(':checkbox').each(function() {
            this.checked = $that.is(':checked');
        });
    });
  

  
  
  $("#delete_row").click(function() {
    var deleted = []
    
    $('input[name=select]').each(function() {
      if ($(this).is(":checked")) {
        deleted.push($(this).closest("tr").attr("name"))
      }
    })
    
   
    if(deleted.length > 0) {
      $.post('/deleteTabs', {
        deleted: deleted,
        tabGroup: groupId
      }, function(response) {
        location.reload()
        console.log("successfully deleted")
      })
    } else {
      alert("Select something to delete!")
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
        tabGroup: groupId
      }, function(response) {
        if(response.success) {
          location.reload()
          console.log("successful save")
        } else {
          console.log("error saving")
          console.log(response.error)
        }
      })
  limit = 1
  })
  
  $("#logout_button").click(function() {
    window.location.href = "/logout"
  })
  



//Moving the tabs around using a drag and drop menu
$('#tab_logic').sortable({
  containerSelector: 'table',
  itemPath: '> tbody',
  itemSelector: 'tr',
  placeholder: '<tr class="placeholder" style="z-index: 999"/>',
  
});

});