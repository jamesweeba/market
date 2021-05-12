const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { PhoneNumberUtil } = require('google-libphonenumber');
const phoneUtil = PhoneNumberUtil.getInstance();

module.exports = {
	hashUserPassword: (plainPassword) => {
		let hashedPassword = bcrypt.hashSync(plainPassword, 10);
		return hashedPassword;
	},

	jwtGenerator: (payload) => {
		let jwtToken = jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
		return jwtToken;
	},

	msisdnValidator: (msisdn) => {
		if (msisdn.indexOf('+') == -1) {
			let err = new Error(`Phone number must begin with +`);
			err.errors = {};
			err.errors.providedInput = msisdn;
			err.errors.message = `Phone number must begin with +`;
			err.code = 'INVALID_PARAMS';
			return err;
		}

		let number = phoneUtil.parseAndKeepRawInput(msisdn);

		const regionCode = phoneUtil.getRegionCodeForNumber(number);
		const valid = phoneUtil.isValidNumberForRegion(number, regionCode);
		if (!valid) {
			let err = new Error(`Phone number is not valid for this region ${regionCode}`);
			err.errors = {};
			err.errors.providedInput = msisdn;
			err.errors.message = `Phone number is not valid for this region ${regionCode}`;
			err.code = 'INVALID_PARAMS';
			return err;
		}
		return msisdn;
	},
};
