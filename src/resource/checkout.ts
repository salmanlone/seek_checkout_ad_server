import { Server, Request, Response, Next } from 'restify';
import ModelRule from '../model/rule';
import ModelAd from '../model/ad';
import Dicsounts from '../discounts/index';
const _ = require('lodash');

export default class Checkout {
    static ApplyRoutes(server: Server) {

        /**
         * @swagger
         * /checkout:
         *   post:
         *     tags:
         *       - checkout
         *     description: Checks-out a given cart for a supplied user
         *     produces:
         *       - application/json
         *     parameters:
         *     - in: "body"
         *       name: "body"
         *       description: "Cart and user itself"
         *       required: true
         *       schema:
         *          type: "object"
         *          properties:
         *             cart:
         *               type: "array"
         *               description: The ad name that are supplied in the cart
         *             username:
         *               type: "string"
         *               description: The user to checkout against
         *     responses:
         *       200:
         *         description: The total of the checkout
         *         schema:
         *            type: number
         *       400:
         *         description: Checkout failed
         */
        server.post('/checkout', function create(req: Request, res: Response, next: Next) {
            let foundRules = [];

            try {
                foundRules = ModelRule.findForCustomer(req.body.username);
            }
            catch (e) {}
            
            let convertedAds = _.map(req.body.cart, item => ModelAd.findOneByName(item));
            let discounts = new Dicsounts(foundRules);
    
            let result = discounts.apply(convertedAds);
            res.json({
                total: result.currentTotal
            });
            return next();
        });
    }
}