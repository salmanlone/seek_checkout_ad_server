const fs = require('fs');
const path = require('path');
import { Server } from 'restify';

export default class Routes {
    static apply(server: Server) {
        let rootResourcePath = path.join(__dirname, '..', 'resource');
        fs.readdir(rootResourcePath, function (err, items) {
            const jsFiles = items.filter(el => /\.js$/.test(el))

            for (var i = 0; i < jsFiles.length; i++) {
                let resource = require(path.join(
                    rootResourcePath,
                    jsFiles[i]
                )).default;
                resource.ApplyRoutes(server);
            }
        });
    }
}