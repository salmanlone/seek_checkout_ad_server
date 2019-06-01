import { Server, Request, Response, Next } from 'restify';
const swaggerJSDoc = require('swagger-jsdoc');
const restify = require('restify');
const path = require('path');

export default class Swagger {
    static ApplyRoutes(server: Server) {
        server.get('/swagger.json', function create(req: Request, res: Response, next: Next) {
            res.setHeader('Content-Type', 'application/json');
            res.send(Swagger.produceSwaggerDefinition());
            return next();
        });
        Swagger.serveSwaggerUI(server);
    }

    static serveSwaggerUI(server) {
        let docsPath = path.join(
            __dirname,
            '..',
            '..',
            'public'
        );

        server.get('/docs/*', restify.plugins.serveStatic({
            directory: docsPath,
            default: 'index.html'
        }));
    }

    static produceSwaggerDefinition() {
        let swaggerDefinition = {
            info: {
                title: 'Seek Asia Assignment API',
                version: '1.0.0',
                description: 'Seek assignment (server)',
            },
            host: 'localhost:9000',
            basePath: '/',
        };

        // options for the swagger docs
        var options = {
            // import swaggerDefinitions
            swaggerDefinition: swaggerDefinition,
            // path to the API docs
            apis: [
                './src/resource/*.ts',
                './src/model/*.ts'
            ],

        };

        // initialize swagger-jsdoc
        return swaggerJSDoc(options);
    }
}