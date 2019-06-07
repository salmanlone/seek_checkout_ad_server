import { Server, Request, Response, Next } from 'restify';
import HttpBasicAuth from '../utils/http_basic_auth';
import { Rules } from '../discounts/index';
import ModelUser from '../model/user';
const _ = require('lodash');

export default class Discount {
    static ApplyRoutes(server: Server) {

        /**
        * @swagger
        * definition:
        *   rule:
        *     properties:
        *       name:
        *         type: string
        *       description:
        *         type: object
        */

        /**
         * @swagger
         * /rule:
         *   get:
         *     tags:
         *       - rule
         *     description: Get all the rules available in the system
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: The rules in the system
         *         schema:
         *           $ref: '#/definitions/rule'
         *       400:
         *         description: Rules not found
         */
        server.get('/rule', HttpBasicAuth('admin', 'admin'), function create(req: Request, res: Response, next: Next) {
            let result = [];

            for (let rule of Rules) {
                result.push({
                    name: rule.NAME,
                    description: rule.description()
                });
            }

            res.json(result);
            return next();
        });

        /**
         * @swagger
         * /rule/customer/{customer_username}:
         *   get:
         *     tags:
         *       - rule
         *     parameters:
         *       - in: path
         *         name: customer_username
         *         schema:
         *           type: string
         *         required: true
         *         description: The username for the customer
         *     description: Gets the rule associated with the particular customer
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: The names of the rules
         *         schema:
         *           type: "object"
         *           properties:
         *             name:
         *               type: string
         *               description: The rule name
         *       400:
         *         description: Rules not found
         */
        server.get('/rule/customer/:customer_username', HttpBasicAuth('admin', 'admin'), function create(req: Request, res: Response, next: Next) {
            let foundUser = ModelUser.findOneByUsername(req.params.customer_username);

            if (!_.isNull(foundUser)) {
                foundUser.delete();
                res.send(200, `User '${req.params.username}' deleted sucessfully`);
                return next();
            }

            let result = [];

            for (let rule of Rules) {
                result.push({
                    name: rule.NAME,
                    description: rule.description()
                });
            }

            res.json(result);
            return next();
        });

        

            if (!_.isNull(foundUser)) {
                foundUser.delete();
                res.send(200, `User '${req.params.username}' deleted sucessfully`);
                return next();
            }

            res.send(404, "The customer does not exist, check username and try again");
            return next();
    }
}