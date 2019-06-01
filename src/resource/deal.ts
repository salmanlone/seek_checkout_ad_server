import { Server, Request, Response, Next } from 'restify';

export default class Deal {
    static ApplyRoutes(server: Server) {
        server.get('/deal', function create(req: Request, res: Response, next: Next) {
            res.send('List the deals associated with the customers');
            return next();
        });
    }
}