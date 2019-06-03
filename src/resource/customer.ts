import { Server, Request, Response, Next } from 'restify';
import HttpBasicAuth from '../utils/http_basic_auth';
import ModelCustomer from '../model/customer';
import ModelUser from '../model/user';
import _ = require('lodash');

export default class Customer {
    static ApplyRoutes(server: Server) {
        /**
       * @swagger
       * definition:
       *   deals:
       *     properties:
       *       id:
       *         type: string
       *       name:
       *         type: string
       *       code:
       *         type: string
       */

        /**
         * @swagger
         * /customer:
         *   get:
         *     security:
         *       - basicAuth:[]
         *     tags:
         *       - customers
         *     description: Get all customers
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: Customers object array
         *         schema:
         *           type: "array"
         *           items:
         *              $ref: '#/definitions/user'
         *       400:
         *         description: No customer exists.
         */
        server.get('/customer', HttpBasicAuth('admin', 'admin'), function create(req: Request, res: Response, next: Next) {
            res.json(ModelUser.findAll());
            return next();
        });

        /**
         * @swagger
         * /customer/{username}:
         *   get:
         *     security:
         *       - basicAuth:[]
         *     tags:
         *       - customer
         *     parameters:
         *       - in: path
         *         name: username
         *         schema:
         *           type: string
         *         required: true
         *         description: The username for the customer
         *     description: Gets customer by username
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: Customer object
         *         schema:
         *           $ref: '#/definitions/user'
         *       400:
         *         description: The customer does not exist.
         */
        server.get('/customer/:username', HttpBasicAuth('admin', 'admin'), function create(req: Request, res: Response, next: Next) {
            let foundUser = ModelUser.findOneByUsername(req.params.username);

            if (!_.isNull(foundUser)) {
                res.json(foundUser);
                return next();
            }

            res.send(404, "The customer does not exist, try adding new instead?");
            return next();
        });

        /**
         * @swagger
         * /customer:
         *   post:
         *     tags:
         *       - customer
         *     description: Creates a new customer in the system
         *     produces:
         *       - application/json
         *     parameters:
         *     - in: "body"
         *       name: "body"
         *       description: "customer object"
         *       required: true
         *       schema:
         *          $ref: '#/definitions/customer_create_tupple'
         *     responses:
         *       200:
         *         description: 
         *         schema:
         *           type: "object"
         *           properties:
         *             message:
         *               type: string
         *               description: A success message for the created customer
         *       400:
         *         description: Customer already exists
         */
        server.post('/customer', HttpBasicAuth('admin', 'admin'), function create(req: Request, res: Response, next: Next) {
            Customer.newCustomer(
                req.body.username,
                req.body.password,
                req.body.name
            );
            res.json({
                'message': `User ${req.body.username} created successfully`
            })
            return next();
        });

        /**
         * @swagger
         * /customer:
         *   put:
         *     tags:
         *       - customer
         *     description: Update customer
         *     produces:
         *       - application/json
         *     parameters:
         *     - in: "body"
         *       name: "body"
         *       description: "Update customer by customer id"
         *       required: true
         *       schema:
         *          $ref: '#/definitions/customers'
         *     responses:
         *       200:
         *         description: Customer object
         *         schema:
         *           $ref: '#/definitions/customers'
         *       400:
         *         description: customer not found
         */
        server.put('/customer', HttpBasicAuth('admin', 'admin'), function create(req: Request, res: Response, next: Next) {
            let response = ModelCustomer.UpdateCustomer(req.body.id, req.body.code);

            if (!_.isNull(response)) {
                res.send(response);
                return;
            }
            res.send(404, `The customer '${req.body.id}' or the deal '${req.body.code}' does not exist, try adding new instead?`);
            return next();
        });

        /**
         * @swagger
         * /customer:
         *   delete:
         *     tags:
         *       - customer
         *     description: Delete customer
         *     produces:
         *       - application/json
         *     parameters:
         *     - in: "body"
         *       name: "body"
         *       description: "Delete customer by customer id"
         *       required: true
         *       schema:
         *          $ref: '#/definitions/customers'
         *     responses:
         *       200:
         *         description: Return true on deleteion otherwise false.
         *         schema:
         *           $ref: '#/definitions/customers'
         *       400:
         *         description: customer not found
         */
        server.del('/customer', HttpBasicAuth('admin', 'admin'), function create(req: Request, res: Response, next: Next) {
            // res.send('List the deals associated with the customers');
            let response = ModelCustomer.DeleteCustomer(req.body.id);

            if (!_.isNull(response)) {
                res.send(200, `${req.body.id} deleted sucessfully. `);
                return;
            }
            res.send(404, "The deal does not exist, try delete with an existing one.");
            return next();
        });


        server.post('/customer/deal', function create(req: Request, res: Response, next: Next) {
            res.send('To create a custom pricing scheme for customer');
            return next();
        });
    }

    static newCustomer(username: string, password: string, name: string) {
        let user = new ModelUser(
            name,
            username,
            password
        );
        user.save();
    }
}