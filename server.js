var express = require("express"),
    stylus  = require('stylus'),
    nib     = require('nib');

var app = express();
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib())
}

app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(stylus.middleware({ src: __dirname + '/public', compile: compile }));
app.use(express.static(__dirname + '/public'))

var router = express.Router();
router.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
});

router.get('/', function(req, res) { res.render('pages/index'); });

app.use('/', router);
app.listen(app.get('port'), function() {
  console.log('Node app is running on port ' + app.get('port'));
});
