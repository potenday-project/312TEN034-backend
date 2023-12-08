var express = require('express');
var path = require('path'); // path 모듈 추가
var app = express();

app.get('*', function (req, res) {
  // test.html 보여주기
  res.sendFile(path.join(__dirname, 'test.html'));
});

app.listen('11111', function () {
  console.log('Express App Server: Listening on port 11111!');
});
