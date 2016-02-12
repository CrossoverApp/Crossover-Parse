$(document).ready(function() {
  var href = $(location).attr("href")
  var groupId = href.substr(href.lastIndexOf('/') + 1)
  var i = $('tbody tr').length - 1;
  
  $("#add_row").click(function() {
    $('#addr' + i).html("<td>" + (i + 1) + "</td><td><input name='title' type='text' placeholder='Title' class='form-control input-md'  /> </td><td><input  name='url' type='text' placeholder='URL'  class='form-control input-md'></td>");

    $('#tab_logic').append('<tr id="addr' + (i + 1) + '" name="new"></tr>');
    i++;
  });

  $("#open_rows").click(function() {
    if (i >= 1) {
     console.log("open all rows clicked");

      $("input[name=url]").each(function() {        
        window.open(/^(http|https):/.test($(this).val()) ? $(this).val() : 'http://' + $(this).val())
      })
    }
  });
  
  $(".button").click(function() {
            window.open(/^(http|https):/.test($(this).val()) ? $(this).val() : 'http://' + $(this).val())

    
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
  
  $("#newTabGroupButton").click(function () {
    swal({
      title: "New Tab Group",
      text: "Please enter a name for your new tab group:",
      type: "input",
      showCancelButton: true,
      closeOnConfirm: false,
      inputPlaceholder: "Write something",
      showLoaderonConfirm: true
    }, function(inputValue) {
      if (inputValue === false) return false;
      if (inputValue === "") {
        swal.showInputError("You need to write something!")
        return false
      }
      $.post('/newTabGroup', {
        title: inputValue
      }, function(response){
        if(response.success) {
          swal("Nice!", "Your new group, " + inputValue+", was created", "success")
          swal({
            title: "Nice!",
            text: "Your new group, " + inputValue+", was created!",
            type: "success",
            showCancelButton: false,
//             confirmButtonColor: "#DD6B55",
            confirmButtonText: "Okay",
            closeOnConfirm: true
          }, function() {
            location.reload()
          });
        } else {
          swal("Oh no!", "We were unable to create your new Tab group. Please try again.", "error")
        }
      })
      
      
    })
  })


});
