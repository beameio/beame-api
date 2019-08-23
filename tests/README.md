<img align="right" src="../img/beame.png">

# Beame SDK - tests

`BEAME_ENV=dev` to run tests against dev environment

`BEAME_ENV=prod` to run tests against prod environment

## cli_tests

Integration tests done using [NGS](https://github.com/ngs-lang/ngs)

`IMPORTANT: Copy your .beame folders into a backup folder and clean them from the system before starting`

`mkdir ~/beame_backup`

`mv ~/.beame* ~/beame_backup` 


### testGetCredsFqdn.ngs
Gets n credentials under the given fqdn
`./testGetCredsFqdn.ngs --start_fqdn xxxxxxxxx.v1.d.beameio.net 3`

### testAll.ngs (requires an unlimited credential)
`BEAME_AUTH_FQDN` will default to the test credential (n6ge8i9q4b4b5vb6.h40d7vrwir2oxlnn.v1.d.beameio.net) that should be available to copy in ~/ 

`BEAME_ENV_PROFILE=dev BEAME_INTERNAL_AUTH_SERVER_FQDN=p2payp4q8f5ruo22.q6ujqecc83gg6fod.v1.d.beameio.net ./testAll.ngs`

## unit_tests

Unit tests for the internal functionality

Currently using the libraries:
-   [Mocha](https://mochajs.org/) - test framework
-   [simple-mock](https://github.com/jupiter/simple-mock) - Mock, stub and spies library

Mocha can be called from `./node-modules/.bin/mocha`

### test_authtoken.js
Tests the Auth Token functionality.

Requires `BEAME_TESTS_LOCAL_FQDN` (fqdn of a local available cred with private key) in order to run the tests against.

### test_beameutils.js
Tests the Beame Utils functionality.

### test_commonutil.js
Tests the Common Utils functionality.

### tests_credentials.js
Tests on the credentials functionality.

Requires `BEAME_TESTS_LOCAL_ROOT_FQDN` (fqdn of a local root available cred)

### tests_custom_credentials.js (requires an unlimited credential)
Tests on the creation of custom credentials.

Requires `BEAME_TESTS_LOCAL_ROOT_FQDN` (fqdn of a local root available cred)
Optionally `BEAME_TESTS_CUSTOM_FQDN` can be passed for a custom fqdn creation in the custom fqdn test.

### test_makeenv.js
Tests the Make Env functionality.

### test_ntp.js
Tests the ntp base functionality.

* Uses `BEAME_TESTS_NTP_SERVER` (default "pool.ntp.org") and `BEAME_TESTS_NTP_SERVER_PORT` (default 123)
* Uses `BEAME_TEST_NTP_RANGE` (default 10) - acceptable NTP time difference

### test_ocsp.js
Tests in the oscp functionality

Requires `BEAME_TESTS_LOCAL_FQDN` (fqdn of a local available cred) in order to run the ocsp tests against.

Sets internally `EXTERNAL_OCSP_FQDN` and `BEAME_OCSP_IGNORE` as required to test the functionality

## Running cli_tests
ToDo

## Running unit_tests

From the tests folder run:

`BEAME_TESTS_LOCAL_ROOT_FQDN=xxxxxxxxxxxxxxx.v1.d.beameio.net BEAME_ENV=dev ../node_modules/mocha/bin/mocha unit_tests/test_credentials.js`

`BEAME_TESTS_LOCAL_FQDN=xxxxxxxxxxxxxxxxx.v1.d.beameio.net BEAME_ENV=dev ../node_modules/mocha/bin/mocha unit_tests/test_ocsp.js`


For debugging information on the tests, add the `DEBUG=beame:sdk:unittests:*`

In production environment, just use a `.p.beameio.net` credential and change the `BEAME_ENV=dev` to `BEAME_ENV=prod`.
