var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {

    app.get('/', function (req, res) {

        res.render('index', {});
        // res.send("Hello");

    });

    app.get("/scrape", function (req, res) {

        axios.get("https://profootballtalk.nbcsports.com/").then(function (response) {

            var $ = cheerio.load(response.data);
            var result = [];
            var data = {
                result: []
            };

            $("h3.top-story").each(function (i, element) {
                var title = $(element).find("a").text();
                var link = $(element).find("a").attr("href");

                data.result.push({
                    title: title,
                    link: link
                });

            })

            // $("section.headlineStack__listContainer").each(function (i, element) {

            //     var title = $(element).find("li").find("a").text();
            //     var link = $(element).find("li").find("a").attr("href");

            //     data.result.push({
            //         title: title,
            //         link: link
            //     });
            // });

            console.log(data);

            res.render('index', data);

            // res.send("Scrape Complete");

            // db.Article.create(result)
            //     .then(function (dbArticle) {
            //     })
            //     .catch(function (err) {
            //       console.log(err);
            //     });
        });

    })
}