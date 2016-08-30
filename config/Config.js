'use strict';
var path = require('path');
var os   = require('os');
var home = os.homedir();

const AuthServerEndPoint = "https://registration-staging.beameio.net";

const CertEndpoint = "https://beameio-net-certs-staging.s3.amazonaws.com";

/** @const {String} **/
var rootDir = process.env.BEAME_DIR || path.join(home, '.beame');

/** @const {String} **/
var localCertsDir = path.join(rootDir, 'v2');

/** @const {String} **/

/** @const {String} **/
var remotePKsDir = path.join(rootDir, 'pki');

/** @const {String} **/
var loadBalancerURL = process.env.BEAME_LB || "http://lb-dev.beameio.net/";

/** @const {String} **/
var metadataFileName = "metadata.json";

/**
 * Certificate file names
 *  @enum {string}
 */
var CertFileNames = {
	"PRIVATE_KEY":      "private_key.pem",
	"TEMP_PRIVATE_KEY": "temp_private_key.pem",
	"X509":             "x509.pem",
	"CA":               "ca.pem",
	"PKCS7":            "pkcs7.pem",
	"P7B":              "p7b.cer",
	"PKCS12":           "cert.pfx",
	"PWD":              "pwd.txt",
	"RECOVERY":         "recovery"
};

/**
 * Certificate file names
 *  @enum {string}
 */
var CertificateFiles = {
	"PRIVATE_KEY": "private_key.pem",
	"X509":        "x509.pem",
	"CA":          "ca.pem",
	"PKCS7":       "pkcs7.pem",
	"P7B":         "p7b.cer",
	"PKCS12":      "cert.pfx",
	"PWD":         "pwd.txt"
};

var CredentialStatus = {
	PRIVATE_KEY:       1 << 1,
	CERT:              1 << 2,
	BEAME_ISSUED_CERT: 1 << 3,
	NON_BEAME_CERT:    1 << 4,
	EMPTY_DIR:         1 << 5,
	DIR_NOTREAD:       1 << 6
};

var SecurityPolicy = {
	Basic:           1 << 0,
	CanHasChildren:  1 << 1,
	CanAuthorize:    1 << 2,
	CanAuthenticate: 1 << 3,
	CanAttachPolicy: 1 << 4
};

/** @enum {String} **/
var IdentityType = {
	"Developer" : "Developer",
	"Atom" : "Atom",
	"EdgeClient" : "EdgeClient"
};

/**
 * Certificate response fields
 *  @enum {string}
 */
var CertResponseFields = {
	"x509":  "x509",
	"pkcs7": "pkcs7",
	"ca":    "ca"
};


/**
 * System Modules
 *  @enum {string}
 */
var AppModules = {
	"IdentityService":      "IdentityService",
	"BeameSDKCli":          "BeameSDKCli",
	"BeameCreds":           "BeameCreds",
	"BeameCrypto":          "BeameCrypto",
	"BeameServer":          "BeameServer",
	"BeameUtils":           "BeameUtils",
	"BeameStore":           "BeameStore",
	"BeameStoreDataHelper": "BeameStoreDataHelper",
	"BeameSystem":          "BeameSystem",
	"BeameDirServices":     "BeameDirServices",
	"Developer":            "Developer",
	"Atom":                 "Atom",
	"EdgeClient":           "EdgeClient",
	"LocalClient":          "LocalClient",
	"ProvisionApi":         "ProvisionApi",
	"DataServices":         "DataServices",
	"UnitTest":             "UnitTest",
	"BaseHttpsServer":      "BaseHttpsServer",
	"SNIServer":            "SNIServer",
	"ProxyClient":          "ProxyClient"
};

/**
 * Message Codes
 *  @enum {string}
 */
var MessageCodes = {
	"DebugInfo":           "DebugInfo",
	"EdgeLbError":         "EdgeLbError",
	"OpenSSLError":        "OpenSSLError",
	"ApiRestError":        "ApiRestError",
	"HostnameRequired":    "HostnameRequired",
	"MetadataEmpty":       "MetadataEmpty",
	"NodeFolderNotExists": "NodeFolderNotExists",
	"NodeFilesMissing":    "NodeFilesMissing",
	"CSRCreationFailed":   "CSRCreationFailed",
	"InvalidPayload":      "InvalidPayload"
};


var ResponseKeys = {
	"NodeFiles":                   [metadataFileName, CertFileNames.PRIVATE_KEY, CertFileNames.X509, CertFileNames.CA, CertFileNames.PKCS7, CertFileNames.P7B, CertFileNames.PKCS12, CertFileNames.PWD],
	"DeveloperCreateResponseKeys": ["hostname", "uid", "name", "email"],
	"AtomCreateResponseKeys":      ["hostname", "uid", "name", "parent_fqdn", "edgeHostname"],
	"EdgeClientResponseKeys":      ["uid", "hostname", "edgeHostname", "parent_fqdn"],
	"LocalClientResponseKeys":     ["uid", "hostname", "parent_fqdn", "edge_client_fqdn", "local_ip"],
	"CertificateResponseKeys":     ["x509", "pkcs7", "ca"],
	"RevokeDevCertResponseKeys":   ["recovery_code"]
};

/**
 * Time units
 *  @enum {string}
 */
var TimeUnits = {
	"Second": "s",
	"Minute": "m",
	"Hour":   "h",
	"Day":    "d"
};

var SNIServerPort = process.env.SNI_SERVER_PORT || 8443;

module.exports = {
	rootDir,
	localCertsDir,
	loadBalancerURL,
	metadataFileName,
	CertFileNames,
	CertificateFiles,
	CertResponseFields,
	AppModules,
	MessageCodes,
	ResponseKeys,
	TimeUnits,
	SNIServerPort,
	AuthServerEndPoint,
	CertEndpoint,
	CredentialStatus,
	SecurityPolicy,
	IdentityType
};
