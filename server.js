var express = require("express"),
    stylus  = require('stylus'),
    nib     = require('nib'),
    pg      = require('pg');

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

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}));

var router = express.Router();
router.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
});

router.get('/', function(req, res) {
  txt = '';

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) throw err;
    console.log('Connected to Postgres DB...');
    client.query('select meeting_id, first_name, last_name, date from employee inner join attendance on employee.employee_id = attendance.employee_id;', function(err, result) {
      done();
      if (err) return console.error('Error in running query', err);

      client.end();
      res.render('pages/index', {results: result.rows});
    });
  });
});

app.use('/', router);

app.route('/check-in')
.get(function(req, res) {
  res.redirect('/');
})
.post(function(req, res) {
  console.log('Processing Post');

  var client = new pg.Client(process.env.DATABASE_URL);
  client.connect();

  var meeting_id = req.body.meeting_id;
  var employee_id = req.body.employee_id;
  console.log(meeting_id, employee_id)

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) throw err;
    console.log('Check-In: Connected to Postgres DB...');
    // TODO Maybe remove Date from attendance schema
    client.query('delete from attendance where meeting_id = ' + (parseInt(meeting_id)).toString() + ' and employee_id = ' + (parseInt(employee_id)).toString(), function(err, result) {
      done();
      if (err) return console.error('Error deleting entry', err);
      client.end();
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port ' + app.get('port'));
});
