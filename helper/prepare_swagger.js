var fs = require('fs');
var path = require('path');

var swaggerIndex = path.join(__dirname, "..", "public", "docs", "index-template.html");

fs.readFile(swaggerIndex, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var result = data.replace(/@swagger_url/g, 'http://localhost:9000/swagger.json');

  fs.writeFile(path.join(__dirname, "..", "public", "docs", "index.html"), result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});