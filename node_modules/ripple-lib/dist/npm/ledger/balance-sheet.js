"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const utils = require("./utils");
const common_1 = require("../common");
function formatBalanceSheet(balanceSheet) {
    const result = {};
    if (!_.isUndefined(balanceSheet.balances)) {
        result.balances = [];
        _.forEach(balanceSheet.balances, (balances, counterparty) => {
            _.forEach(balances, balance => {
                result.balances.push(Object.assign({ counterparty }, balance));
            });
        });
    }
    if (!_.isUndefined(balanceSheet.assets)) {
        result.assets = [];
        _.forEach(balanceSheet.assets, (assets, counterparty) => {
            _.forEach(assets, balance => {
                result.assets.push(Object.assign({ counterparty }, balance));
            });
        });
    }
    if (!_.isUndefined(balanceSheet.obligations)) {
        result.obligations = _.map(balanceSheet.obligations, (value, currency) => ({ currency, value }));
    }
    return result;
}
function getBalanceSheet(address, options = {}) {
    common_1.validate.getBalanceSheet({ address, options });
    return utils.ensureLedgerVersion.call(this, options).then(_options => {
        const request = {
            command: 'gateway_balances',
            account: address,
            strict: true,
            hotwallet: _options.excludeAddresses,
            ledger_index: _options.ledgerVersion
        };
        return this.connection.request(request).then(formatBalanceSheet);
    });
}
exports.default = getBalanceSheet;
//# sourceMappingURL=balance-sheet.js.map