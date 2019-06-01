var restify = require('restify');
import Routes from "./config/routes";

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();
Routes.apply(server);
// server.get('/hello/:name', respond);
// server.head('/hello/:name', respond);

server.listen(9000, function() {
  console.log('%s listening at %s', server.name, server.url);
});