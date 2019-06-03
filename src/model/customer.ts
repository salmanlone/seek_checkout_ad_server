import UserDb from '../utils/user_db';
import ModelDeal from "./deal";
const _ = require('lodash');

/**
 * @swagger
 * definition:
 *   customer:
 *     properties:
 *       id:
 *         type: string
 *       name:
 *         type: string
 *       subcription:
 *         type: string
 */

export default class ModelCustomer {
    private static db = new UserDb().Instance;
    private username: string;
    private name: string;
    private password: string;

    constructor(username:string, password: string, name: string = '') {
        this.name = name;
        this.username = username;
        this.password = password;
    }

    get Name() {
        return this.name;
    }

    get Username() {
        return this.username;
    }

    save() {
        let foundCustomer = ModelCustomer.findOne(this.id);

        if (_.isEmpty(foundCustomer)) {
            ModelCustomer.db.get('customers')
                .push({
                    id: this.id,
                    name: this.name,
                    code: this.code
                }).write();

            return true;
        }
    }

    static GetCustomers() {
        return ModelCustomer.db.get('customers');
    }

    static GetCustomer(id: string) {
        let foundCustomer = ModelCustomer.findOne(id);

        if (!_.isEmpty(foundCustomer)) {
            return foundCustomer;
        }

        return null;
    }

    static UpdateCustomer(id: string, code: string) {
        let foundCustomer = ModelCustomer.findOne(id);

        if (!_.isEmpty(foundCustomer)) {

            let isDealExist = ModelDeal.findSub(code);

            if(!_.isEmpty(isDealExist)){
                let udpatedCustomer = ModelCustomer.db.get('customers')
                .find({ id: id })
                .assign({ code: code })
                .write();
            return udpatedCustomer;
            }
        }

        return null;
    }

    static DeleteCustomer(id: string) {
        let foundCustomer = ModelCustomer.findOne(id);

        if (!_.isEmpty(foundCustomer)) {
            let foundCustomer = ModelCustomer.db.get('customers')
                .remove({ id: id })
                .write();

            return true;
        }

        return null;
    }

    static GetCustomerDeal(id: string) {
        // let foundCustomer = ModelCustomer.db.get('customers')
        //     .find({ Id: id })
        //     .value();

        // if (!_.isEmpty(foundCustomer)) {
        //     let foundDeal = ModelDeal.db.get('daels')
        //     .find({id: foundCustomer.id})
        // }
        //check if customer exist
        //id not then return default daeals
    }

    static findOne(id: string) {
        let foundCustomer = ModelCustomer.db.get('customers')
            .find({ id: id })
            .value();

        if (!_.isEmpty(foundCustomer)) {
            return new ModelCustomer(foundCustomer.id, foundCustomer.name,
                foundCustomer.code);
        }

        return null;
    }
}