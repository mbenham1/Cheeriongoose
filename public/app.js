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

$(document).on("click", "#delete", function () {

    var thisID = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/delete/" + thisID
    })
        .then(function (data) {
            location.reload();
        });

});

$(document).on("click", "#preview", function () {

    var link = $(this).attr("data-link");
    var thisLink = {link: link}
    // console.log(thisLink);
    $.post("/", thisLink, function(data) {
        // console.log(data);
        window.scrollTo(0,0);
        $(".preview-tab").text(data);
    })

})

var here = window.location.href;

$(document).on("click", "#scrape", function () {

    $.get("/scrape").then(function (data) {
        // alert("Please refresh!")
    });

    setTimeout(function(){
        window.location.reload(1);
     }, 1500);
})

$(document).on("click", "#submit", function () {
    // Grab the id associated with the article from the submit button
    var thisID = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisID,
        data: {
            body: $("#add-comment").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#add-comment").val("");
});


