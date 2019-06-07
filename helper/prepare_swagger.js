require('dotenv').config();
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var swaggerUrl = process.env.SWAGGER_URL || "https://seekasia-assignment-server.herokuapp.com";
var swaggerPort = process.env.PORT || 9000;
var swaggerHost = process.env.SWAGGER_HOST || "seekasia-assignment-server.herokuapp.com";

let indexFile = path.join(__dirname, "..", "public", "docs", "index.html");
let indexTmpl = path.join(__dirname, "..", "public", "docs", "index-template.html");

let swaggerResourcePath = path.join(__dirname, "..", "src", "resource", "swagger.ts");
let swaggerResourceTmplPath = path.join(__dirname, "..", "src", "resource", "swagger_tmpl.ts.txt");

fs.unlinkAsync(indexFile)
  .then(() => fs.readFileAsync(indexTmpl, 'utf8'))
  .then(data => data.replace(/@swagger_url/g, `${swaggerUrl}:${swaggerPort}/swagger.json`))
  .then(writeData => fs.writeFileAsync(indexFile, writeData, 'utf8'))
  .then(() => console.log("Swagger public file ready"))
  .catch(e => console.log(e));

fs.readFileAsync(swaggerResourceTmplPath, 'utf8')
  .then(data => data.replace(/@swagger_host/g, `${swaggerHost}`))
  .then(data => {
    return fs.unlinkAsync(swaggerResourcePath)
      .then(() => fs.writeFileAsync(swaggerResourcePath, data, 'utf8'))
  })
  .then(() => console.log("Swagger resource API ready"))
  .catch(e => console.log(e));