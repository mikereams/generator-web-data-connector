// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>

var express = require('express'),
    request = require('request'),
    app = express();

app.use(express.static('./'));

// Proxy the index.html file.
app.get('/', function (req, res) {
  res.sendFile('./index.html');
});

// Create a proxy endpoint.
app.get('/proxy', function (req, res) {
  var options = {
        url: 'https://api.example.com/your/endpoint',
        headers: {
          Accept: 'application/json',
          'User-Agent': '<%= props.appname %>/0.0.0',
          'X-Key': req.query.key
        }
      };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
    else {
      res.sendStatus(403);
    }
  })
});

module.exports = app;
