import { Server, Request, Response, Next } from 'restify';

export default class Customer {
    static ApplyRoutes(server: Server) {
        server.post('/customer', function create(req: Request, res: Response, next: Next) {
            res.send('To create customer');
            return next();
        });
    
        server.post('/customer/deal', function create(req: Request, res: Response, next: Next) {
            res.send('To create a custom pricing scheme for customer');
            return next();
        });
    }
}