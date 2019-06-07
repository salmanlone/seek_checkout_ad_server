import RuleDb from '../utils/rule_db';
import ModelUser from './user';
import { Rules } from '../discounts/index';
import PriceDropDiscount from '../discounts/price_drop_discount';
import XForYDiscount from '../discounts/x_for_y_discount';
const _ = require('lodash');

/**
 * @swagger
 * definition:
 *   user:
 *     properties:
 *       name:
 *         type: string
 *       username:
 *         type: string
 */

 interface RuleRealization {
     rule: PriceDropDiscount | XForYDiscount;
 }

/**
 * @swagger
 * definition:
 *   customer_create_tupple:
 *     properties:
 *       username:
 *         type: string
 *       name:
 *         type: string
 *       password:
 *         type: string
 */
export default class ModelRule {

    private static db = new RuleDb().Instance;
    private rule: any;
    private customer: ModelUser;
    private parameters: object;
    private realizedRule: RuleRealization;


    constructor(rule_name: string, customer_username: string, parameters: object) {
        let foundUser = ModelUser.findOneByUsername(customer_username);

        if (_.isNull(foundUser)) {
            throw new Error(`User ${customer_username} not found to file rule against`);
        }

        let foundRule = _.findIndex(Rules, rule => {
            return _.isEqual(rule.NAME, rule_name);
        });

        if (foundRule == -1) {
            throw new Error(`Rule ${rule_name} is not registered in the system`);
        }

        foundRule.parameter_validation(parameters);

        this.rule = Rules[foundRule].NAME;
        this.customer = foundUser;
        this.parameters = parameters;
        this.realizedRule = foundRule.createFromParamsSchema(
            parameters
        );
    }

    delete() {
        return ModelRule.db.get('rules')
            .remove({
                username: this.customer.Username,
                rule: this.rule,
                rule_params: this.parameters
            })
            .write();
    }

    save() {
        ModelRule.db.get('rules')
            .push({
                username: this.customer.Username,
                rule: this.rule,
                rule_params: this.parameters
            })
            .write();
    }

    static findForCustomer(username) {
        let rules = ModelRule.db.get('rules')
            .find({
                username: username
            })
            .value();

        let result = [];

        if (!_.isEmpty(rules)) {
            for (let rule of rules)
            {
                let foundRule = _.find(Rules, r => _.isEqual(r.NAME, rule));
                if (!_.isEmpty(foundRule))
                {
                    result.push(foundRule.createFromParamsSchema(
                        rule.rule_params
                    ));
                }
            }
        }

        return result;
    }
}