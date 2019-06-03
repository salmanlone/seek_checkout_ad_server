import { Server, Request, Response, Next } from 'restify';
import HttpBasicAuth from '../utils/http_basic_auth';
import ModelCustomer from '../model/customer';
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
         *     description: get all customers
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: Customers object array
         *         schema:
         *           $ref: '#/definitions/customers'
         *       400:
         *         description: No customer exist.
         */
        server.get('/customers', HttpBasicAuth('admin', 'admin'), function create(req: Request, res: Response, next: Next) {
            res.send(ModelCustomer.GetCustomers());
            return next();
        });

        /**
         * @swagger
         * /customer:
         *   get:
         *     tags:
         *       - customer
         *     description: get customer by id
         *     produces:
         *       - application/json
         *     parameters:
         *     - in: "body"
         *       name: "body"
         *       description: "Customer object"
         *       required: true
         *       schema:
         *          $ref: '#/definitions/customers'
         *     responses:
         *       200:
         *         description: Customer object
         *         schema:
         *           $ref: '#/definitions/customers'
         *       400:
         *         description: The customer does not exist.
         */
        server.get('/customer/:id', HttpBasicAuth('admin', 'admin'), function create(req: Request, res: Response, next: Next) {
            let response = ModelCustomer.GetCustomer(req.params.id);

            if (!_.isNull(response)) {
                res.send(response);
                return;
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
         *     description: Create new ad customer
         *     produces:
         *       - application/json
         *     parameters:
         *     - in: "body"
         *       name: "body"
         *       description: "customer object"
         *       required: true
         *       schema:
         *          $ref: '#/definitions/customers'
         *     responses:
         *       200:
         *         description: Deals object array
         *         schema:
         *           $ref: '#/definitions/customers'
         *       400:
         *         description: customer not found
         */
        server.post('/customer', HttpBasicAuth('admin', 'admin'), function create(req: Request, res: Response, next: Next) {
            Customer.newCustomer(
                req.body.id,
                req.body.name,
                req.body.code,
                res);
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

    static newCustomer(id: string, name: string, code: string,
        res: Response) {
        let foundDeal = ModelCustomer.findOne(id);

        if (_.isEmpty(foundDeal)) {
            let model = new ModelCustomer(id, name, code);
            model.Save();

            res.send({
                "id": id,
                "name": name,
                "code": code
            });
            return;
        }

        res.send(404);
    }
}