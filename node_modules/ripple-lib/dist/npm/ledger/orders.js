"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const utils = require("./utils");
const common_1 = require("../common");
const account_order_1 = require("./parse/account-order");
function requestAccountOffers(connection, address, ledgerVersion, marker, limit) {
    return connection.request({
        command: 'account_offers',
        account: address,
        marker: marker,
        limit: utils.clamp(limit, 10, 400),
        ledger_index: ledgerVersion
    }).then(data => ({
        marker: data.marker,
        results: data.offers.map(_.partial(account_order_1.default, address))
    }));
}
function getOrders(address, options = {}) {
    common_1.validate.getOrders({ address, options });
    return utils.ensureLedgerVersion.call(this, options).then(_options => {
        const getter = _.partial(requestAccountOffers, this.connection, address, _options.ledgerVersion);
        return utils.getRecursive(getter, _options.limit).then(orders => _.sortBy(orders, order => order.properties.sequence));
    });
}
exports.default = getOrders;
//# sourceMappingURL=orders.js.map