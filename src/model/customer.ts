import Database from "../utils/database";
import ModelDeal from "./deal";
const _ = require('lodash');

class CustomerDb {
    static instance = null;

    constructor() {
        if (!CustomerDb.instance) {

            const dbDef: Database = new Database(
                process.env.TEST_DB || 'customer.json',
                { customers: [] }
            );

            CustomerDb.instance = dbDef.Instance;
        }
    }

    get Instance() {
        return CustomerDb.instance;
    }
}

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
    private static db = new CustomerDb().Instance;
    private id: string;
    private name: string;
    private code: string;

    constructor(id: string, name: string, code: string) {
        this.id = id;
        this.name = name;
        this.code = code;
    }

    get Id() {
        return this.id;
    }

    get Name() {
        return this.name;
    }

    get Code() {
        return this.code;
    }

    Save() {
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