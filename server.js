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
mongoose.connect("mongodb://localhost/scraper", { useNewUrlParser: true });

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});