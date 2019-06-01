import { Server, Request, Response, Next } from 'restify';

export default class User {
    static ApplyRoutes(server: Server) {
        /**
         * @swagger
         * /user:
         *   post:
         *     tags:
         *       - user
         *     description: Tries to login the user to our system
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: User object
         *         schema:
         *           $ref: '#/definitions/user'
         *       400:
         *         description: User not found
         */
        server.post('/user', function create(req: Request, res: Response, next: Next) {
            res.send('Authentication gate for user');
            return next();
        });
    }

    static create(username: string, password: string, name:string)
    {

    }
}