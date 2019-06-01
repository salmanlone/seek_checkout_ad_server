import { Server, Request, Response, Next } from 'restify';

export default class User {
    static ApplyRoutes(server: Server) {
        server.post('/user', function create(req: Request, res: Response, next: Next) {
            res.send('Authentication gate for user');
            return next();
        });
    }
}