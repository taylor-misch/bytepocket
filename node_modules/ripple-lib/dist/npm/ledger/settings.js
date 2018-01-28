"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const fields_1 = require("./parse/fields");
const common_1 = require("../common");
const AccountFlags = common_1.constants.AccountFlags;
function parseFlags(value) {
    const settings = {};
    for (const flagName in AccountFlags) {
        if (value & AccountFlags[flagName]) {
            settings[flagName] = true;
        }
    }
    return settings;
}
function formatSettings(response) {
    const data = response.account_data;
    const parsedFlags = parseFlags(data.Flags);
    const parsedFields = fields_1.default(data);
    return _.assign({}, parsedFlags, parsedFields);
}
function getSettings(address, options = {}) {
    common_1.validate.getSettings({ address, options });
    const request = {
        command: 'account_info',
        account: address,
        ledger_index: options.ledgerVersion || 'validated',
        signer_lists: true
    };
    return this.connection.request(request).then(formatSettings);
}
exports.default = getSettings;
//# sourceMappingURL=settings.js.map