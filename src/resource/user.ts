import { Server, Request, Response, Next } from 'restify';
import ModelUser from './../model/user';
const _ = require('lodash');

export default class User {
    static ApplyRoutes(server: Server) {

        /**
        * @swagger
        * definition:
        *   credentials:
        *     properties:
        *       username:
        *         type: string
        *       password:
        *         type: string
        */

        /**
         * @swagger
         * /user:
         *   post:
         *     tags:
         *       - user
         *     description: Tries to login the user to our system
         *     produces:
         *       - application/json
         *     parameters:
         *     - in: "body"
         *       name: "body"
         *       description: "User object to authenticate against"
         *       required: true
         *       schema:
         *          $ref: '#/definitions/credentials'
         *     responses:
         *       200:
         *         description: User object
         *         schema:
         *           $ref: '#/definitions/user'
         *       400:
         *         description: User not found
         */
        server.post('/user', function create(req: Request, res: Response, next: Next) {
            // res.send(JSON.stringify(req.body));
            User.login(req.body.username, req.body.password, res);
            return next();
        });
    }

    static login(username: string, password: string, res: Response) {
        let foundUser = ModelUser.findOne(username, password);
        if (!_.isEmpty(foundUser))
        {
            res.json({
                "welcome_message": `Hello ${foundUser.Name}`,
                "username": foundUser.Username
            });
            return;
        }
        res.send(404);
    }
}