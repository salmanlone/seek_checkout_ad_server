import Database from "./database";

class UserDb {
    static instance = null;

    constructor() {
        if (!UserDb.instance) {

            const dbDef: Database = new Database(
                process.env.TEST_DB || 'users.json',
                { users: [] }
            );

            UserDb.instance = dbDef.Instance;
        }
    }

    get Instance() {
        return UserDb.instance;
    }
}

export default UserDb;