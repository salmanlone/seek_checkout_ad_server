import { Server, Request, Response, Next } from 'restify';

export default class Cart {
    static ApplyRoutes(server: Server) {
        server.get('/cart', function create(req: Request, res: Response, next: Next) {
            res.send('Gets the cart for the session');
            return next();
        });
    
        server.get('/cart/checkout', function create(req: Request, res: Response, next: Next) {
            res.send('Brings back the rules applied state for the cart');
            return next();
        });
    }
}