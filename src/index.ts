var restify = require('restify');
import * as corsMiddleware from "restify-cors-middleware";
import Routes from "./config/routes";

let serverPort = process.env.PORT || 9000;

const cors = corsMiddleware({
  origins: ["*"],
  allowHeaders: ["Authorization"],
  exposeHeaders: ["Authorization"]
});

var server = restify.createServer();

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

server.pre(cors.preflight);
server.use(cors.actual);

Routes.apply(server);
// server.get('/hello/:name', respond);
// server.head('/hello/:name', respond);

server.listen(serverPort, function () {
  console.log('%s listening at %s', server.name, server.url);
});