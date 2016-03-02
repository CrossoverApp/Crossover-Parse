$(document).ready(function() {
  var href = $(location).attr("href")
  var groupId = href.substr(href.lastIndexOf('/') + 1)
  var i = $('tbody tr').length - 1;
  var url = window.location.href;
  var onerow = 1;
  
  $("#add_row").click(function() {
    
    if(onerow == 1) {
    $('#addr' + i).html("<td>" + (i + 1) + "</td><td><input name='title' type='text' placeholder='Title' class='form-control input-md'  /> </td><td><input  name='url' type='text' placeholder='URL'  class='form-control input-md'></td>");

    $('#tab_logic').append('<tr id="addr' + (i + 1) + '" name="new"></tr>');
    i++;
    onerow = 2
    }
    else{
      alert("Please save current row before adding more tabs")
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
    
//     if (i >= 1) {
//       // can replace if statement w/ below once checkbox in place and
//       // when checkbox list is retrieved
//    // while (i >= 1){
//       // if((tabslist[i-1].attr('type') == 'checkbox')&&(tabslist[i-1].checked)){
   
//       //is the line necessary?
//      // $("#addr" + (i - 1)).html(''); 
      
//       deleted.push($("#addr"+(i-1)).attr("name"))
      
//        //is the line necessary?
//       //$("#addr"+(i-1)).attr("name", "")
//       i--;
      
    
//    } 
   
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
    onerow = 1
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
  
  })
  
  $("#logout_button").click(function() {
    window.location.href = "/logout"
  })
  

  //New Tab Group Button
  $("#newTabGroupButton").click(function () {
		var tabTitle = ""
    swal({
      title: "New Tab Group",
      text: "Please enter a name for your new tab group:",
			html: '<p style="padding-bottom: 20px">Enter a name for your new Tab Group: </p> <p><input id="input-field" style="margin: 10px; padding: 5px; font-size: 20px;"></p>',
      showCancelButton: true,
      closeOnConfirm: false,
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
            title: "Nice!",
            text: "Your new group, \"" + tabTitle+"\", was created!",
            type: "success"
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
            title: 'Input something',
            html: '<p><input id="input-field">',
            showCancelButton: true,
            closeOnConfirm: false
        },
        function() {
            swal({
              html:
                'You entered: <strong>' +
                $('#input-field').val() +
                '</strong>'
            });
        });
      
});
$('#tab_logic').sortable({
  containerSelector: 'table',
  itemPath: '> tbody',
  itemSelector: 'tr',
  placeholder: '<tr class="placeholder" style="z-index: 999"/>'
});

});
