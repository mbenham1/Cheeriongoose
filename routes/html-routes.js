var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {

    app.get('/', function (req, res) {

        db.Article.find({}).limit(20).exec(function(error,data){

            var hbsObject = {
                article: data
            };
            console.log(hbsObject);
            res.render("index", hbsObject);
    
        })

    });

    app.get("/scrape", function (req, res) {

        axios.get("https://profootballtalk.nbcsports.com/").then(function (response) {

            var $ = cheerio.load(response.data);

            $("h3.top-story").each(function (i, element) {

                var result = {};
                result.title = $(element).find("a").text();
                result.link = $(element).find("a").attr("href");

            res.send("Scrape Complete");
            db.Article.create(result)
                .then(function (dbArticle) {
                    // console.log(result)
                })
                .catch(function (err) {
                  console.log(err);
                });
            })
        });

    })

  app.get("/articles", function (req, res) {

    db.Article.find({})
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });

  });

  // Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("comment")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });



}