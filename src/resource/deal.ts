import { Server, Request, Response, Next } from 'restify';
import ModelDeal from '../model/deal';
import _ = require('lodash');

export default class Deal {
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
        *       price:
        *         type: double
        *       type:
        *         type: string
        *       code:
        *         type: string
        */

        /**
         * @swagger
         * /deal:
         *   post:
         *     tags:
         *       - deal
         *     description: Create new ad deal
         *     produces:
         *       - application/json
         *     parameters:
         *     - in: "body"
         *       name: "body"
         *       description: "Deals object array"
         *       required: true
         *       schema:
         *          $ref: '#/definitions/deals'
         *     responses:
         *       200:
         *         description: Deals object array
         *         schema:
         *           $ref: '#/definitions/deal'
         *       400:
         *         description: Deals not found
         */

        server.post('/deal', function create(req: Request, res: Response, next: Next) {
            Deal.newDeal(
                req.body.id,
                req.body.name,
                req.body.price,
                req.body.type,
                req.body.code,
                res);
            return next();
        });

                /**
         * @swagger
         * /deal:
         *   get:
         *     tags:
         *       - deal
         *     description: get all deals
         *     produces:
         *       - application/json
         *     parameters:
         *     - in: "body"
         *       name: "body"
         *       description: "deals object array"
         *       required: true
         *       schema:
         *          $ref: '#/definitions/deals'
         *     responses:
         *       200:
         *         description: deals object array
         *         schema:
         *           $ref: '#/definitions/deals'
         *       400:
         *         description: No deal exist.
         */
        server.get('/deals', function create(req: Request, res: Response, next: Next) {
            // res.send('List the deals associated with the customers');
            res.send(ModelDeal.GetDeals());
            return next();
        });

        /**
         * @swagger
         * /deal:
         *   get:
         *     tags:
         *       - deal
         *     description: get deal by itype and code
         *     produces:
         *       - application/json
         *     parameters:
         *     - in: "body"
         *       name: "body"
         *       description: "Deal object"
         *       required: true
         *       schema:
         *          $ref: '#/definitions/deals'
         *     responses:
         *       200:
         *         description: Deal object
         *         schema:
         *           $ref: '#/definitions/deals'
         *       400:
         *         description: The deal does not exist.
         */
        server.get('/deal/:type/:code', function create(req: Request, res: Response, next: Next) {
            // res.send('List the deals associated with the customers');
            let response = ModelDeal.GetDeal(req.params.type, req.params.code);
            
            if(!_.isNull(response)){
                res.send(response);    
                return;
            }
            res.send(404, "The deal does not exist, try adding new instead?");
            return next();
        });

        /**
         * @swagger
         * /deal:
         *   put:
         *     tags:
         *       - deal
         *     description: Update deal
         *     produces:
         *       - application/json
         *     parameters:
         *     - in: "body"
         *       name: "body"
         *       description: "Update deal by type and code"
         *       required: true
         *       schema:
         *          $ref: '#/definitions/deals'
         *     responses:
         *       200:
         *         description: Deal object
         *         schema:
         *           $ref: '#/definitions/deals'
         *       400:
         *         description: deal not found
         */
        server.put('/deal', function create(req: Request, res: Response, next: Next) {
            // res.send('List the deals associated with the customers');
            let response = ModelDeal.UpdateDeal(req.body.type, req.body.code, req.body.price);
            
            if(!_.isNull(response)){
                res.send(response);    
                return;
            }
            res.send(404, "The deal does not exist, try adding new instead?");
            return next();
        });

        /**
         * @swagger
         * /deal:
         *   delete:
         *     tags:
         *       - deal
         *     description: Delete deal
         *     produces:
         *       - application/json
         *     parameters:
         *     - in: "body"
         *       name: "body"
         *       description: "Delete deal by type and code"
         *       required: true
         *       schema:
         *          $ref: '#/definitions/deals'
         *     responses:
         *       200:
         *         description: Return true on deleteion otherwise false.
         *         schema:
         *           $ref: '#/definitions/deals'
         *       400:
         *         description: deal not found
         */
        server.del('/deal', function create(req: Request, res: Response, next: Next) {
            let response = ModelDeal.DeleteDeal(req.body.type, req.body.code);
            
            if(!_.isNull(response)){
                res.send(200, `${req.body.code} deleted sucessfully. `);    
                return;
            }
            res.send(404, "The deal does not exist, try delete with an existing one.");
            return next();
        });
    }

    static newDeal(id: string, name: string, price: number, type:string, code:string,
         res:Response){
        let foundDeal = ModelDeal.findOne(type, code);
        
        if(_.isEmpty(foundDeal)){
            let model = new ModelDeal(id,name,price,type,code);
            model.Save();
            
            res.send({
                "id": id,
                "name": name,
                "price": price,
                "type":type,
                "code":code
            });
            return;
        }
        
        res.send(404);
    }
}