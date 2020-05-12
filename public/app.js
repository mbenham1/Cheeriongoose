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
        $(".preview-tab").text(data.preview);
        $("#preview-image").attr({"src": data.image, "height": 250, "width": 300});
        $("#preview-image").css({"padding": 10});
    })

})

var here = window.location.href;

$(document).on("click", "#scrape", function () {

    $.get("/scrape").then(function (data) {
    });

    setTimeout(function(){
        window.location.reload(1);
     }, 1500);
})

// To Add = Comment Section

$(document).on("click", "#submit", function () {

    var thisID = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisID,
        data: {
            body: $("#add-comment").val()
        }
    })

        .then(function (data) {
            console.log(data);
            $("#notes").empty();
        });

    $("#add-comment").val("");
});


