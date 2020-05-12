var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {

  app.get('/', function (req, res) {

    db.Article.find({}).exec(function (error, data) {
      var reverse = data.reverse();

      var hbsObject = {
        article: reverse
      };
      // console.log(hbsObject);
      res.render("index", hbsObject);

    })

  });

  app.post('/', function (req, res) {
    var link = req.body.link;
    // console.log(link);

    axios.get(link).then(function (response) {

      var $ = cheerio.load(response.data);

      $("div.entry-content").each(function (i, element) {

        var result = {};
        result.preview = $(element).find("p").text();
        result.image = $(element).find("img").attr("src");
        res.json(result);
        
      })
    })

  })

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

    res.json("Scrape Complete");

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
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
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