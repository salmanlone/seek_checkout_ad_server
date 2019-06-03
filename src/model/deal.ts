import Database from "../utils/database";
const _ = require('lodash');

class DealDb {
    static instance = null;

    constructor() {
        if (!DealDb.instance) {

            const dbDef: Database = new Database(
                process.env.TEST_DB || 'deal.json',
                { deals: [] }
            );

            DealDb.instance = dbDef.Instance;
        }
    }

    get Instance() {
        return DealDb.instance;
    }
}

/**
 * @swagger
 * definition:
 *   deal:
 *     properties:
 *       id:
 *         type: string
 *       name:
 *         type: string
 *       price:
 *         type: string
 */

export default class ModelDeal {
    private static db = new DealDb().Instance;
    private id: string;
    private name: string;
    private price: number;
    private type: string;
    private code: string;

    constructor(id: string, name: string, price: number, type:string, code:string){
        this.id = id;
        this.name = name;
        this.price = price;
        this.type = type;
        this.code = code;
    }

    get Id(){
        return this.id;
    }

    get Name(){
        return this.name;
    }

    get Price(){
        return this.price;
    }

    get Type(){
        return this.type;
    }

    get Code(){
        return this.code;
    }

    Save(){
        let foundDeal = ModelDeal.findOne(this.type, this.code);

        if(_.isEmpty(foundDeal)){
            ModelDeal.db.get('deals')
                .push({
                    id: this.id,
                    name: this.name,
                    price: this.price,
                    type: this.type,
                    code: this.code
                }).write();

            return true;
        }
    }

    static GetDeals(){
        return ModelDeal.db.get('deals');
    }

    static GetDeal(type: string, code: string) {
        let foundDeal =  ModelDeal.findOne(type, code);

        if(!_.isEmpty(foundDeal)){
            return foundDeal;
        }

        return null;
    }

    static UpdateDeal(type: string, code: string, price: number) {
        let foundDeal =  ModelDeal.findOne(type, code);

        if(!_.isEmpty(foundDeal)){
            let updatedDeal =  ModelDeal.db.get('deals')
            .find({type: type, code: code})
            .assign({price: price})
            .write();

            return updatedDeal;
        }

        return null;
    }

    static DeleteDeal(type: string, code: string) {
        let foundDeal =  ModelDeal.findOne(type, code);

        if(!_.isEmpty(foundDeal)){
            let deletedDeal =  ModelDeal.db.get('deals')
            .remove({type: type, code: code})
            .write();
            return true;
        }

        return null;
    }

    static findOne(type: string, code: string) {
        let foundDeal = ModelDeal.db.get('deals')
            .find({ type: type, code: code })
            .value();

        if (!_.isEmpty(foundDeal)) {
            return new ModelDeal(foundDeal.id, foundDeal.name, foundDeal.price, 
                foundDeal.type, foundDeal.code);
        }

        return null;
    }

    static findSub(code: string) {
        let foundSubscription = ModelDeal.db.get('deals')
            .find({code: code })
            .value();

        if (!_.isEmpty(foundSubscription)) {
            return new ModelDeal(foundSubscription.id, foundSubscription.name, 
                foundSubscription.price, 
                foundSubscription.type, foundSubscription.code);
        }

        return null;
    }
}