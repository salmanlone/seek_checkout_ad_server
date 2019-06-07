import { Server, Request, Response, Next } from 'restify';
import HttpBasicAuth from '../utils/http_basic_auth';
import { Rules } from '../discounts/index';
import ModelRule from '../model/rule';
const _ = require('lodash');

export default class Rule {
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
        * definition:
        *   rule_create_tupple:
        *     properties:
        *       rule_name:
        *         type: string
        *       customer_username:
        *         type: string
        *       rule_parameters:
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
         *         description: Rules associated with the user in system
         *         schema:
         *           type: "array"
         *           properties:
         *             name:
         *               type: string
         *               description: The rule name
         *             parameters:
         *               type: object
         *               description: The rule parameters to form it against
         *       400:
         *         description: Rules not found
         */
        server.get('/rule/customer/:customer_username', HttpBasicAuth('admin', 'admin'), function create(req: Request, res: Response, next: Next) {
            let foundRules = ModelRule.findForCustomer(req.params.customer_username);
            res.json(foundRules);
            return next();
        });

        /**
         * @swagger
         * /rule/customer:
         *   post:
         *     tags:
         *       - rule
         *     description: Adds a rule associated with a customer in the system
         *     produces:
         *       - application/json
         *     parameters:
         *     - in: "body"
         *       name: "body"
         *       description: "User object to authenticate against"
         *       required: true
         *       schema:
         *          $ref: '#/definitions/rule_create_tupple'
         *     responses:
         *       200:
         *         description: User object
         *         schema:
         *           $ref: '#/definitions/user'
         *       400:
         *         description: User not found
         */
        server.post('/rule/customer', HttpBasicAuth('admin', 'admin'), function create(req: Request, res: Response, next: Next) {
            let newRule = new ModelRule(
                req.body.rule_name,
                req.body.customer_username,
                req.body.rule_parameters
            );

            newRule.save();
            res.send(200);
            return next();
        });
    }
}