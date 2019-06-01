import Database from "../utils/database";
import { LowdbSync } from "lowdb";
const _ = require('lodash');

const dbDef: Database = new Database(
    'users.json',
    { users: [] }
);
const db: LowdbSync<null> = Object.freeze(dbDef.Instance);

export default class User {

    private name: string;
    private username: string;
    private password: string;

    constructor(name: string, username: string, password: string) {
        this.name = name;
        this.username = username;
        this.password = password;
    }

    get Username() {
        return this.username;
    }

    get Name() {
        return this.name;
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