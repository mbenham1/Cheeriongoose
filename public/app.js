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

$(document).on("click", "#scrape", function () {

    $.get("/scrape").then(function (data) {
        console.log("Scrape successful");
    });
    location.reload();

})


