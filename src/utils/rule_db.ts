import Database from "./database";

class RuleDb {
    static instance = null;

    constructor() {
        if (!RuleDb.instance) {

            const dbDef: Database = new Database(
                process.env.TEST_DB || 'rules.json',
                { rules: [] }
            );

            RuleDb.instance = dbDef.Instance;
        }
    }

    get Instance() {
        return RuleDb.instance;
    }
}

export default RuleDb;