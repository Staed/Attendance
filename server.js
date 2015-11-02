var express = require("express");
var app = express();
var port = process.env.PORT || 5000;

var router = express.Router();
router.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
});

router.get('/', function(req, res) {
  res.send('Home page');
});

app.use('/', router);
app.listen(port);
console.log('Node app is running on port ' + port);
