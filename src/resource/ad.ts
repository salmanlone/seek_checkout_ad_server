import { Server, Request, Response, Next } from 'restify';
import HttpBasicAuth from '../utils/http_basic_auth';
import ModelAd from '../model/ad';
import _ = require('lodash');

export default class Ad {

    static ApplyRoutes(server: Server) {
        /**
         * @swagger
         * /ad:
         *   post:
         *     security:
         *       - basicAuth:[]
         *     tags:
         *       - ad
         *     description: Create new ad
         *     produces:
         *       - application/json
         *     parameters:
         *     - in: "body"
         *       name: "body"
         *       description: "Ad object"
         *       required: true
         *       schema:
         *          $ref: '#/definitions/ad_create_tupple'
         *     responses:
         *       200:
         *         description:
         *         schema:
         *           type: "object"
         *           properties:
         *             message:
         *               type: string
         *               description: A success message for the created ad
         *       400:
         *         description: Ad not found
         */
        server.post('/ad', HttpBasicAuth('admin', 'admin'), function create(req: Request, res: Response, next: Next) {
            Ad.create(
                req.body.name,
                req.body.price,
                req.body.currency,
                res
            );
            res.json({
                'message': `Ad ${req.body.name} created successfully`
            });
            return next();
        });

        /**
         * @swagger
         * /ad:
         *   get:
         *     security:
         *       - basicAuth:[]
         *     tags:
         *       - ads
         *     description: Get list of ads
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: Array of ads
         *         schema:
         *           type: "array"
         *           items:
         *              $ref: '#/definitions/ad_tupple'
         *       400:
         *         description: No ad found in system
         */
        server.get('/ad', function create(req: Request, res: Response, next: Next) {
            res.json(ModelAd.findAll());
            return next();
        });

        /**
         * @swagger
         * /ad/{ad_id}:
         *   get:
         *     tags:
         *       - ad
         *     description: get ad by id
         *     produces:
         *       - application/json
         *     parameters:
         *       - in: path
         *         name: ad_id
         *         schema:
         *           type: number
         *         required: true
         *         description: The ad id to retreive
         *     responses:
         *       200:
         *         description: Ad object
         *         schema:
         *           $ref: '#/definitions/ad_tupple'
         *       400:
         *         description: The ad does not exist.
         */
        server.get('/ad/:ad_id', function create(req: Request, res: Response, next: Next) {
            let foundAd = ModelAd.findOne(req.params.ad_id);

            if (!_.isNull(foundAd)) {
                res.json(foundAd);
                return next();
            }

            res.send(404, "The ad does not exist, try adding new instead?");
            return next();
        });

        /**
         * @swagger
         * /ad:
         *   put:
         *     tags:
         *       - ad
         *     description: Update ad
         *     produces:
         *       - application/json
         *     parameters:
         *     - in: "body"
         *       name: "body"
         *       description: "Update ad on ad id"
         *       required: true
         *       schema:
         *          $ref: '#/definitions/ads'
         *     responses:
         *       200:
         *         description: ad object
         *         schema:
         *           $ref: '#/definitions/ads'
         *       400:
         *         description: ad not found
         */
        server.put('/ad', function create(req: Request, res: Response, next: Next) {
            // let response = ModelAd.UpdateAd(req.body.id, req.body.price);

            // if (!_.isNull(response)) {
            //     res.send(response);
            //     return;
            // }
            // res.send(404, `The customer '${req.body.id}' does not exist, try adding new instead?`);
            // return next();
        });

        /**
         * @swagger
         * /ad:
         *   delete:
         *     tags:
         *       - ad
         *     description: Delete ad
         *     produces:
         *       - application/json
         *     parameters:
         *     - in: "body"
         *       name: "body"
         *       description: "Delete ad by ad id"
         *       required: true
         *       schema:
         *          $ref: '#/definitions/ads'
         *     responses:
         *       200:
         *         description: Return true on deleteion otherwise false.
         *         schema:
         *           $ref: '#/definitions/ads'
         *       400:
         *         description: ad not found
         */
        server.del('/ad', function create(req: Request, res: Response, next: Next) {
            // let response = ModelAd.DeleteAd(req.body.id);

            // if (!_.isNull(response)) {
            //     res.send(200, `${req.body.id} deleted sucessfully. `);
            //     return;
            // }
            // res.send(404, "The ad does not exist, try delete with an existing one.");
            // return next();
        });
    }

    static create(name: string, price: number, currency: string, res: Response) {
        let adToBeCreated = new ModelAd(
            name,
            price,
            currency
        );
        adToBeCreated.save();
    }
}