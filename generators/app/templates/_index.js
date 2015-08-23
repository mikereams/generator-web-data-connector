// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>

var express = require('express'),
    request = require('request'),
    app = express();

// Serve files as if this were a static file server.
app.use(express.static('./'));

// Proxy the index.html file.
app.get('/', function (req, res) {
  res.sendFile('./index.html');
});

// Create a proxy endpoint.
app.get('/proxy', function (req, res) {
  // Note that the "buildApiFrom(path)" helper in main.js sends the API endpoint
  // as a query parameter to our proxy. We read that in here and build the real
  // endpoint we want to hit.
  var realPath = req.query.endpoint,
      options = {
        url: 'https://api.example.com/' + realPath,
        headers: {
          Accept: 'application/json',
          'User-Agent': '<%= props.appname %>/0.0.0'
        }
      };

  // Make an HTTP request using the above specified options.
  console.log('Attempting to proxy request to ' + options.url);
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
    else {
      console.log('Error fulfilling request: "' + error.toString() + '"');
      res.sendStatus(403);
    }
  })
});

var server = app.listen(9001, function () {
  var port = server.address().port;
  console.log('Express server listening on port ' + port);
});

module.exports = app;
