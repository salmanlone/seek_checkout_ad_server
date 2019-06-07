const fetch = require('node-fetch');
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require('fs'));
const url = require('url');
const path = require('path');
const _ = require('lodash');

// let basicAuth = Buffer.from("admin:admin").toString('base64');

// const BASE_URL = process.env.BASE_URL || "http://localhost:9000";

// const createUrl = (path) => {
//     return url.resolve(BASE_URL, path);
// }

// Clean up the databases
function cleanUpDatabase() {
    let databases = [
        'users.json',
        'ad.json',
        'customer.json',
        'deal.json',
        'rules.json'
    ];

    return new Promise.resolve(() => {
        for (let db in databases) {
            try {
                fs.unlinkSync(path.join(__dirname, '..', db));
            }
            catch (e) { }
        }
    });
    // ((resolve, reject) => {
    //     for (let db in databases) {
    //         try {
    //             fs.unlinkSync(path.join(__dirname, '..', db));
    //         }
    //         catch (e) { }
    //     }
    //     resolve(true);
    // });
}

// Create users
function createAssignmentUsers() {
    let users = [
        "unilever",
        "apple",
        "nike",
        "ford"
    ];

    let userFile = {
        "users": [
        ]
    };

    for (let user of users) {
        userFile.users.push({
            username: user,
            name: _.startCase(user),
            password: user
        });
    }

    return fs.writeFileAsync(
        path.join(__dirname, '..', 'users.json'),
        JSON.stringify(userFile)
    );
}

// Create Ads
function createAssignmentAds() {
    let ads = [
        {
            "name": "classic",
            "price": 269.99,
            "currency": "USD"
        },
        {
            "name": "standout",
            "price": 322.99,
            "currency": "USD"
        },
        {
            "name": "premium",
            "price": 394.99,
            "currency": "USD"
        }
    ];

    let adFile = {
        "ads": [],
        "last_id": 1
    };

    for (let ad of ads) {
        adFile.ads.push({
            id: ++adFile.last_id,
            name: ad.name,
            price: ad.price,
            currency: ad.currency
        });
    }

    return fs.writeFileAsync(
        path.join(__dirname, '..', 'ad.json'),
        JSON.stringify(adFile)
    );
}

// Create customer rules
function createCustomerRules() {
    let rules = [
        {
            "rule_name": "x_for_y",
            "customer_username": "unilever",
            "rule_parameters": {
                "ad": "classic",
                "xCount": 3,
                "yCount": 2
            }
        },
        {
            "rule_name": "price_drop",
            "customer_username": "apple",
            "rule_parameters": {
                "ad": "standout",
                "discountedPrice": 299.99,
                "countOrMore": 1
            }
        },
        {
            "rule_name": "price_drop",
            "customer_username": "nike",
            "rule_parameters": {
                "ad": "premium",
                "discountedPrice": 379.99,
                "countOrMore": 4
            }
        },
        {
            "rule_name": "x_for_y",
            "customer_username": "ford",
            "rule_parameters": {
                "ad": "classic",
                "xCount": 5,
                "yCount": 4
            }
        },
        {
            "rule_name": "price_drop",
            "customer_username": "ford",
            "rule_parameters": {
                "ad": "standout",
                "discountedPrice": 309.99,
                "countOrMore": 1
            }
        },
        {
            "rule_name": "price_drop",
            "customer_username": "ford",
            "rule_parameters": {
                "ad": "premium",
                "discountedPrice": 389.99,
                "countOrMore": 3
            }
        },
    ];

    let ruleFile = {
        "rules": []
    };

    for (let rule of rules) {
        ruleFile.rules.push({
            username: rule.customer_username,
            rule: rule.rule_name,
            rule_params: rule.rule_parameters
        });
    }

    return fs.writeFileAsync(
        path.join(__dirname, '..', 'rules.json'),
        JSON.stringify(ruleFile)
    );
}

// Main
cleanUpDatabase()
    .then(() => createAssignmentUsers())
    .then(() => createAssignmentAds())
    .then(() => createCustomerRules())
    .then(() => console.log("Server seeded!"))
    .catch((e) => console.log(e));