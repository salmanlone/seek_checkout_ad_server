import { Server, Request, Response, Next } from 'restify';

export default class Ad {
    static ApplyRoutes(server: Server) {
        server.get('/ad', function create(req: Request, res: Response, next: Next) {
            res.send('Brings back the available ads in the system');
            return next();
        });
    }
}