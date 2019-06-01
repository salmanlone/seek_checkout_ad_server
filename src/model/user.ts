// const low = require('lowdb');
// const FileSync = require('lowdb/adapters/FileSync');


// const adapter = new FileSync('users.json');
// const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
// db.defaults({ users: [] })
//     .write()

import Database from "../utils/database";
import { LowdbSync } from "lowdb";
const _ = require('lodash');

const dbDef: Database = new Database(
    'users.json',
    { users: [] }
);
const db: LowdbSync<null> = Object.freeze(dbDef.Instance);

export default class User {

    name: string;
    username: string;
    password: string;

    constructor(name: string, username: string, password: string) {
        this.name = name;
        this.username = username;
        this.password = password;
    }

    save() {
        let existentUser = db.get('users')
            .value()
            .find({ username: this.username })

        if (_.empty(existentUser)) {
            db.get('users')
                .value()
                .push({
                    username: this.username,
                    name: this.name,
                    password: this.password
                })
                .write();
        }

        throw new Error("User already exists, try logging in instead?");
    }

    static findOne(username, password) {
        let existentUser = db.get('users')
            .value()
            .find({ username: username, password: password})

        return !_.empty(existentUser);
    }
}