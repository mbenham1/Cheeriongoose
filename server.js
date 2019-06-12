// Boilerplating

var express     = require("express");
var exphbs      = require("express-handlebars");
var mongoose    = require("mongoose");
var path        = require('path');

var PORT = process.env.PORT || 3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/public", express.static(path.join(__dirname, 'public')));

require("./routes/html-routes.js")(app);

// Handlebars Boilerplate
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Mongoose Boilerplate
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";

mongoose.connect(MONGODB_URI);


app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});