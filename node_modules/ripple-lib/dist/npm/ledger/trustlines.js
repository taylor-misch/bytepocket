"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const utils = require("./utils");
const common_1 = require("../common");
const account_trustline_1 = require("./parse/account-trustline");
function currencyFilter(currency, trustline) {
    return currency === null || trustline.specification.currency === currency;
}
function formatResponse(options, data) {
    return {
        marker: data.marker,
        results: data.lines.map(account_trustline_1.default)
            .filter(_.partial(currencyFilter, options.currency || null))
    };
}
function getAccountLines(connection, address, ledgerVersion, options, marker, limit) {
    const request = {
        command: 'account_lines',
        account: address,
        ledger_index: ledgerVersion,
        marker: marker,
        limit: utils.clamp(limit, 10, 400),
        peer: options.counterparty
    };
    return connection.request(request).then(_.partial(formatResponse, options));
}
function getTrustlines(address, options = {}) {
    common_1.validate.getTrustlines({ address, options });
    return this.getLedgerVersion().then(ledgerVersion => {
        const getter = _.partial(getAccountLines, this.connection, address, options.ledgerVersion || ledgerVersion, options);
        return utils.getRecursive(getter, options.limit);
    });
}
exports.default = getTrustlines;
//# sourceMappingURL=trustlines.js.map