var fs = require('fs');
var path = require('path');
var swaggerUrl = process.env.SWAGGER_URL || "https://seekasia-assignment-server.herokuapp.com";
var swaggerPort = process.env.PORT || 9000;

var swaggerIndex = path.join(__dirname, "..", "public", "docs", "index-template.html");

fs.readFile(swaggerIndex, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var result = data.replace(/@swagger_url/g, `${swaggerUrl}:${swaggerPort}/swagger.json`);

  fs.writeFile(path.join(__dirname, "..", "public", "docs", "index.html"), result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});