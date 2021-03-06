"use strict";

const assert = require('assert').strict;
const ntpClient = require('ntp-client');
const util = require('util');

const config = require("../../config/Config");
const debug = require("debug")(config.debugPrefix + "unittests:ntp");

const ntpServer = process.env.BEAME_TESTS_NTP_SERVER || "pool.ntp.org";
const ntpServerPort = process.env.BEAME_TESTS_NTP_SERVER_PORT || 123;
const range = Number.parseInt(process.env.BEAME_TEST_NTP_RANGE || '10');

describe('ntp', () => {
	it('check date', async () => {
		const date = await util.promisify(ntpClient.getNetworkTime.bind(ntpClient, ntpServer, ntpServerPort))();
		const local = new Date();

		debug("Current ntp time is: ", date);
		assert(date);
		debug("Current machine time is: ", local);
		assert(local);

		const diff =  Math.abs((date.getTime() - local.getTime()) / 1000);
		debug("diff is : ",diff);
		assert(diff < range);
	});
});
