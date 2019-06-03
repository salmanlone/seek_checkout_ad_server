import Database from "../utils/database";
const _ = require('lodash');

class AdDb {
    static instance = null;

    constructor() {
        if (!AdDb.instance) {

            const dbDef: Database = new Database(
                process.env.TEST_DB || 'ad.json',
                { ads: [] }
            );

            AdDb.instance = dbDef.Instance;
        }
    }

    get Instance() {
        return AdDb.instance;
    }
}

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
 */

export default class ModelAd {
    private static db = new AdDb().Instance;
    private id: string;
    private name: string;
    private price: string;

    constructor(id: string, name: string, price: string) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    get Id() {
        return this.id;
    }

    get Name() {
        return this.name;
    }

    get Price() {
        return this.price;
    }

    Save() {
        let foundAd = ModelAd.db.get('ads')
            .find({ id: this.id })
            .value();

        if (_.isEmpty(foundAd)) {
            ModelAd.db.get('ads')
                .push({
                    id: this.id,
                    name: this.name,
                    price: this.price
                }).write();

            return true;
        }
    }

    static GetAds() {
        return ModelAd.db.get('ads');
    }

    static GetAd(id: string) {
        let foundAd = ModelAd.findOne(id);

        if (!_.isEmpty(foundAd)) {
            return foundAd;
        }

        return null;
    }

    static UpdateAd(id: string, price: string) {
        let foundad = ModelAd.findOne(id);

        if (!_.isEmpty(foundad)) {
            let udpatedCustomer = ModelAd.db.get('ads')
                .find({ id: id })
                .assign({ price: price })
                .write();
            return udpatedCustomer;
        }

        return null;
    }

    static DeleteAd(id: string) {
        let foundAd = ModelAd.findOne(id);

        if (!_.isEmpty(foundAd)) {
            ModelAd.db.get('ads')
                .remove({ id: id })
                .write();

            return true;
        }

        return null;
    }

    static findOne(id) {
        let foundAd = ModelAd.db.get('ads')
            .find({ id: id })
            .value();

        if (!_.isEmpty(foundAd)) {
            return new ModelAd(foundAd.id, foundAd.name, foundAd.price);
        }

        return null;
    }
}