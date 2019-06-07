import { Server, Request, Response, Next } from 'restify';
import HttpBasicAuth from '../utils/http_basic_auth';
import ModelUser from './../model/user';
const _ = require('lodash');

export default class Discount {
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
         * /discount:
         *   get:
         *     tags:
         *       - discount
         *     description: Get all the discounts available in the system
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: The discounts in the system
         *         schema:
         *           $ref: '#/definitions/user'
         *       400:
         *         description: User not found
         */
        server.get('/discount', HttpBasicAuth('admin', 'admin'), function create(req: Request, res: Response, next: Next) {
            // User.login(req.body.username, req.body.password, res);
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