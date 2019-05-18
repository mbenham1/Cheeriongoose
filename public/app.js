// $.getJSON("/articles", function(data) {
//     $("tbody").empty();
//     for (var i = 0; i < 8; i++) {
//         var tr = $("<tr>").append(
//             ("<td data-id='" + data[i]._id + "'>" + data[i].title + "</td>"),
//             (`<td data-id= ${data[i]._id} ><a href="${data[i].link}"> ${data[i].link}  </a></td>`)
//         );
//     $("tbody").append(tr);
//     }
//   });

$(document).on("click", "#comment", function() {
    $("#comment-modal").modal();
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        link: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });