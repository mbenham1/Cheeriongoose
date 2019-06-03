var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {

  app.get('/', function (req, res) {

    db.Article.find({}).exec(function (error, data) {

      var hbsObject = {
        article: data
      };
      // console.log(hbsObject);
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

        db.Article.create(result)
          .then(function (dbArticle) {
            console.log(result)
          })
          .catch(function (err) {
            console.log(err);
          });
      })

    });

    res.send("Scrape Complete");

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

  app.get("/articles/:id", function (req, res) {
    db.Article.find({
      _id: req.params.id 
    }).then(function(dbArticle){
      var hbsObject = {
        article: dbArticle
      };
        res.render('comments', hbsObject);
    }).catch(function(err){
      res.json(err);
    });
  });

  app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("comment")
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.post("/articles/:id", function(req, res) {
    console.log(req.body);
    // Create a new note and pass the req.body to the entry
    db.Comment.create(req.body)
      .then(function(dbComment) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


  app.get("/delete/:id", function (req, res) {
    var docId = req.params.id;
    db.Article.deleteOne({
      _id: docId
    })
      .then(function (dbArticle) {
        db.Comment.deleteMany({
          threadid: docId
        })
          .then(function (dbComment) {
            location.reload();
          }).catch(function (err1) {
            res.json(err1)
          })
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.get("/api/clear", function(req, res) {

	  db.Article.collection.drop();
    res.send(200);

  });

}