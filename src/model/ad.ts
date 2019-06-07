import Database from "../utils/database";
const _ = require('lodash');

class AdDb {
    static instance = null;

    constructor() {
        if (!AdDb.instance) {

            const dbDef: Database = new Database(
                process.env.TEST_DB || 'ad.json',
                { ads: [], last_id: 1 }
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
  *   ad_create_tupple:
  *     properties:
  *       name:
  *         type: string
  *       price:
  *         type: integer
  *       currency:
  *         type: string
  */

/**
  * @swagger
  * definition:
  *   ad_tupple:
  *     properties:
  *       name:
  *         type: string
  *       price:
  *         type: integer
  *       id:
  *         type: integer
  *       currency:
  *         type: string
  */

export default class ModelAd {
    private static db = new AdDb().Instance;
    private id: number;
    private name: string;
    private price: number;
    private currency: string;

    constructor(name: string, price: number, currency: string, id: number = null) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.currency = currency;
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

    get Currency() {
        return this.currency;
    }

    delete() {
        if (this.id == null) {
            // No need to delete, its in memory
            return;
        }
        else {
            return ModelAd.db.get('ads')
                .remove({
                    id: this.id,
                    name: this.name,
                    price: this.price,
                    currency: this.currency
                })
                .write();
        }
    }

    save() {
        if (this.id == null) {
            // A freshly created Ad
            this.id = ModelAd.db.get('last_id').value();
            ModelAd.db
                .get('ads')
                .push({
                    id: this.id,
                    name: this.name,
                    price: this.price,
                    currency: this.currency
                })
                .write();

            ModelAd.db.update('last_id', n => n + 1)
                .write();

            return true;
        }
        else {
            // An ad update
            let foundAd = ModelAd.db
                .get('ads')
                .find({ id: this.id })
                .value();

            if (_.isEmpty(foundAd)) {
                throw new Error("An error occurred with dirty data please try the immutable ad");
            }

            let currentAds = ModelAd.db
                .get('ads')
                .value();

            let updateAd = this;

            let updatedAds = _.map(currentAds, (ad) => {
                if (_.isEqual(updateAd.id, ad.id)) {
                    return {
                        id: updateAd.id,
                        name: updateAd.name,
                        price: updateAd.price,
                        currency: updateAd.currency
                    };
                }
                return ad;
            });

            ModelAd.db.set('ads', updatedAds).write();
            return true;
        }
    }

    static findAll() {
        return ModelAd.db
            .get('ads')
            .value();
    }

    static findOne(id: number) {
        let foundAd = ModelAd.db.get('ads')
            .find({ id: id })
            .value();

        if (!_.isEmpty(foundAd)) {
            return new ModelAd(
                foundAd.name,
                foundAd.price,
                foundAd.currency,
                foundAd.id
            );
        }

        return null;
    }

    static findOneByName(name: string) {
        let foundAd = ModelAd.db.get('ads')
            .find({ name: name })
            .value();

        if (!_.isEmpty(foundAd)) {
            return new ModelAd(
                foundAd.name,
                foundAd.price,
                foundAd.currency,
                foundAd.id
            );
        }

        return null;
    }
}