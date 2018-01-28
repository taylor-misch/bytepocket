"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
const ledger_1 = require("./parse/ledger");
function getLedger(options = {}) {
    common_1.validate.getLedger({ options });
    const request = {
        command: 'ledger',
        ledger_index: options.ledgerVersion || 'validated',
        expand: options.includeAllData,
        transactions: options.includeTransactions,
        accounts: options.includeState
    };
    return this.connection.request(request).then(response => ledger_1.default(response.ledger));
}
exports.default = getLedger;
//# sourceMappingURL=ledger.js.map