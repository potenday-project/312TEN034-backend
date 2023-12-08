var express = require('express');
var app = express();

app.get('/', function (req, res) {
   res.send('Hello Express Server!');
});

app.listen(3000, function () {
   console.log('Express App Server : Listening on port 3000!');
});
