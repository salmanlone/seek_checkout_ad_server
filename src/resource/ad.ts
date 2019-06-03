import { Server, Request, Response, Next } from 'restify';
import ModelAd from '../model/ad';
import _ = require('lodash');

export default class Ad {

    static ApplyRoutes(server: Server) {
        /**
        * @swagger
        * definition:
        *   ad:
        *     properties:
        *       id:
        *         type: string
        *       name:
        *         type: string
        *       price:
        *         type: string
        * 
        */

        /**
         * @swagger
         * /ad:
         *   post:
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
         *          $ref: '#/definitions/ads'
         *     responses:
         *       200:
         *         description: Ad object
         *         schema:
         *           $ref: '#/definitions/Ad'
         *       400:
         *         description: Ad not found
         */
        server.post('/ad', function create(req: Request, res: Response, next: Next) {
            Ad.addAd(req.body.id, req.body.name, req.body.price, res);
            return next();
        });

        /**
         * @swagger
         * /ad:
         *   get:
         *     tags:
         *       - ads
         *     description: Get list of ads
         *     produces:
         *       - application/json
         *     parameters:
         *     - in: "body"
         *       name: "body"
         *       description: "Ads object array"
         *       required: true
         *       schema:
         *          $ref: '#/definitions/ads'
         *     responses:
         *       200:
         *         description: Ads object array
         *         schema:
         *           $ref: '#/definitions/Ads'
         *       400:
         *         description: No ad found in system
         */
        server.get('/ads', function create(req: Request, res: Response, next: Next) {
            // res.send('Brings back the available ads in the system');
            res.send(ModelAd.GetAds());
            return next();
        });

        /**
         * @swagger
         * /ad:
         *   get:
         *     tags:
         *       - ad
         *     description: get ad by id
         *     produces:
         *       - application/json
         *     parameters:
         *     - in: "body"
         *       name: "body"
         *       description: "ad object"
         *       required: true
         *       schema:
         *          $ref: '#/definitions/ads'
         *     responses:
         *       200:
         *         description: Customer object
         *         schema:
         *           $ref: '#/definitions/ads'
         *       400:
         *         description: The ad does not exist.
         */
        server.get('/ad/:id', function create(req: Request, res: Response, next: Next) {
            let response = ModelAd.GetAd(req.params.id);

            if (!_.isNull(response)) {
                res.send(response);
                return;
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
            let response = ModelAd.UpdateAd(req.body.id, req.body.price);

            if (!_.isNull(response)) {
                res.send(response);
                return;
            }
            res.send(404, `The customer '${req.body.id}' does not exist, try adding new instead?`);
            return next();
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
            let response = ModelAd.DeleteAd(req.body.id);

            if (!_.isNull(response)) {
                res.send(200, `${req.body.id} deleted sucessfully. `);
                return;
            }
            res.send(404, "The ad does not exist, try delete with an existing one.");
            return next();
        });
    }

    static addAd(id: string, name: string, price: string, res: Response) {
        let foundDeal = ModelAd.findOne(id);

        if (_.isEmpty(foundDeal)) {
            let model = new ModelAd(id, name, price);
            model.Save();

            res.send({
                "id": id,
                "name": name,
                "price": price
            });
            return;
        }

        res.send(404);
    }
}