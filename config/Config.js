'use strict';
/**
 * @typedef {Object} RegistrationPayload
 * @property {String} fqdn
 * @property {String} parent_fqdn
 * @property {Number} level
 */
const path       = require('path');
const os         = require('os');
const home       = os.homedir();
const npmPrefix  = require('npm-prefix');
const npmRootDir = npmPrefix();
const debugPrefix = 'beame:sdk:';

const ActionsApi = {
	"EntityApi": {
		"RegisterEntity": {
			"endpoint": "/api/v1/node/register"
		},
		"CompleteRegistration": {
			"endpoint": "/api/v1/node/register/complete"
		},
		"UpdateEntity": {
			"endpoint": "/api/v1/node/update"
		},
		"GetMetadata": {
			"endpoint": "/api/v1/node/get/meta"
		},
		"SubscribeRegistration": {
			"endpoint": "/api/v1/node/subscribe/registration"
		},
		"CertRevoke": {
			"endpoint": "/api/v1/node/cert/revoke"
		},
		"CertRenew": {
			"endpoint": "/api/v1/node/cert/renew"
		},
		"SaveAuthEvent":{
			"endpoint": "/api/v1/node/event/save"
		}
	},
	"AuthServerApi": {
		"RegisterEntity": {
			"endpoint": "/node/auth/register"
		}
	},
	"DnsApi": {
		"Set": {
			"endpoint": "/v1/dns/set/"
		},
		"Get": {
			"endpoint": "/v1/dns/list/"
		},
		"Delete": {
			"endpoint": "/v1/dns/delete/"
		}
	},
	"OcspApi":{
		"Check":{
			"endpoint": "/check"
		},
		"HttpGetProxy":{
			"endpoint": "/http_get"
		},
		"Time":{
			"endpoint": "/time/get"
		}
	}
};

const environments = {
	dev: {
		Name: 'Dev',
		FqdnPattern: '.d.',
		CertEndpoint:  'https://beameio-net-certs-dev.s3.amazonaws.com',
		AuthServerURL: 'https://p2payp4q8f5ruo22.q6ujqecc83gg6fod.v1.d.beameio.net',
		TestsCredsFqdn: 'n6ge8i9q4b4b5vb6.h40d7vrwir2oxlnn.v1.d.beameio.net',
		BaseUrl: 'https://xmq6hpvgzt7h8m76.mpk3nobb568nycf5.v1.d.beameio.net',
		BaseDNSUrl:'https://t24w58ow5jkkmkhu.mpk3nobb568nycf5.v1.d.beameio.net',
		RetryAttempts: 10,
		LoadBalancerFqdn: 'may129m153e6emrn.bqnp2d2beqol13qn.v1.d.beameio.net',
		OcspProxyFqdn: 'i6zirg0jsrzrk3dk.mpk3nobb568nycf5.v1.d.beameio.net',
	},

	prod: {
		Name: 'Prod',
		FqdnPattern: '.p.',
		CertEndpoint: 'https://beameio-net-certs.s3.amazonaws.com',
		AuthServerURL: 'https://ypxf72akb6onjvrq.ohkv8odznwh5jpwm.v1.p.beameio.net',
		TestsCredsFqdn: 'am53rz8o6cjsm0xm.gjjpak0yxk8jhlxv.v1.p.beameio.net',
		BaseUrl: 'https://ieoateielwkqnbuw.tl5h1ipgobrdqsj6.v1.p.beameio.net',
		BaseDNSUrl:'https://lcram0sj9ox726l1.tl5h1ipgobrdqsj6.v1.p.beameio.net',
		RetryAttempts: 10,
		LoadBalancerFqdn: 'ioigl3wzx6lajrx6.tl5h1ipgobrdqsj6.v1.p.beameio.net',
		OcspProxyFqdn: 'iep9bs1p7cj3cmit.tl5h1ipgobrdqsj6.v1.p.beameio.net',
	},

	_COMMON: {
		Dir: path.join(home, '.beame'),
		CdrDir: path.join(home, '.beame_cdr'),
		LogDir: "",
		ForceEdgeFqdn: "",
		ForceEdgeIp: 0,
		CertValidityPeriod: 60 * 60 * 24 * 365, // 365 days (in sec)
		OcspCachePeriod: 1000 * 60 * 60 * 24 * 30,  // 30 days (in ms)
		RenewalCheckInterval: 1000 * 60 * 60 * 24, // 1 day (in ms)
		RenewalPercentageBeforeExpiration: 8, // 8% before cred expiration
		RenewalBeforeExpirationMaxPeriod: 1000 * 60 * 60 * 24 * 45, // 45 days (in ms)
		ExternalOcspFqdn: "",
		ExternalOcspSigningFqdn: "",
	}
};
const SelectedProfile = require('../src/utils/makeEnv')(environments, {protectedProperties: ['Name', 'FqdnPattern']});
SelectedProfile.LogDir = SelectedProfile.LogDir || path.join(SelectedProfile.Dir, 'logs');

/* Deprecated ENV Variables */
if (process.env.EXTERNAL_OCSP_FQDN) {
	console.error("EXTERNAL_OCSP_FQDN environment variable is not used anymore. Please use BEAME_EXTERNAL_OCSP_FQDN.");
	process.exit(1);
}
if (process.env.BEAME_LOAD_BALANCER_URL) {
	console.error("BEAME_LOAD_BALANCER_URL environment variable is not used anymore. Please use BEAME_LOAD_BALANCER_FQDN.");
	process.exit(1);
}


/**
 * Registration sources
 * DON'T TOUCH, should by synchronized with backend services
 * @readonly
 * @enum {Number}
 */
const RegistrationSource = {
	"Unknown":        0,
	"NodeJSSDK":      1,
	"InstaSSL":       2,
	"InstaServerSDK": 3,
	"IOSSDK":         4
};

const RequestType = {
	"RequestWithFqdn":       "RequestWithFqdn",
	"RequestWithParentFqdn": "RequestWithParentFqdn",
	"RequestWithAuthServer": "RequestWithAuthServer",
};

const CredAction = {
	"Revoke":          "Revoke",
	"Renew":           "Renew",
	"SendByEmail":     "Send by email",
	"Download":        "Download",
	"VpnRootCreated":  "Set as VPN Root",
	"VpnRootDeleted":  "VPN Root Deleted",
	"ChildCreated":    "Child cred created",
	"RegTokenCreated": "Reg token created",
	"DnsSaved":        "Dns Saved",
	"DnsDeleted":      "Dns deleted",
	"OcspUpdate":      "OCSP status updated",
	"RolesUpdate":     "RolesUpdate"
};

/**
 * Certificate file names
 *  @enum {string}
 */
const CertFileNames = {
	"PRIVATE_KEY":        "private_key.pem",
	"PUBLIC_KEY":         "public_key.pem",
	"BACKUP_PRIVATE_KEY": "private_key_bk.pem",
	"BACKUP_PUBLIC_KEY":  "public_key_bk.pem",
	"X509":               "x509.pem",
	"P7B":                "p7b.cer",
	"PKCS12":             "cert.pfx",
	"PWD":                "pwd.txt"
};

/**
 * Certificate file names
 *  @enum {string}
 */
const LogFileNames = {
	"LOGIN_DIARY":        "login_diary.json"
};

/**
 * Log Event Codes
 *  @enum {string}
 */
const LogEvents = {
	"LoginSuccess":        "LoginSuccess",
	"ExpiredCred":         "ExpiredCred",
	"RevokedCred":         "RevokedCred"
};


const MetadataProperties = {
	LEVEL:         "level",
	FQDN:          "fqdn",
	UID:           "uid",
	NAME:          "name",
	PARENT_FQDN:   "parent_fqdn",
	APPROVER_FQDN: "approved_by_fqdn",
	DNS:           "dnsRecords",
	REVOKED:       "revoked",
	ACTIONS:       "actions",
	OCSP_STATUS:   "ocspStatus"
};

/**
 * Certificate response fields
 *  @enum {string}
 */
const CertResponseFields = {
	"x509": "x509",
	"p7b":  "p7b",
	"ca":   "ca"
};

/**
 * Auth events
 *  @enum {string}
 */
const AuthEventType = {
	"TokenIssued": "TokenIssued",
	"Created":     "Created"
};


/**
 * SAN prefix
 *  @enum {string}
 */
const AltPrefix = {
	"Approver": "appr.",
	"Parent":   "parent."
};



/**
 * System Modules
 *  @enum {string}
 */
const AppModules = {
	"AutoRenewer":      "AutoRenewer",
	"Credential":       "Credential",
	"BeameEntity":      "BeameEntity",
	"BeameSDKCli":      "BeameSDKCli",
	"BeameCreds":       "BeameCreds",
	"BeameCrypto":      "BeameCrypto",
	"BeameServer":      "BeameServer",
	"BeameUtils":       "BeameUtils",
	"BeameStore":       "BeameStore",
	"BeameSystem":      "BeameSystem",
	"BeameDirServices": "BeameDirServices",
	"ProvisionApi":     "BeameRequest",
	"DataServices":     "DataServices",
	"UnitTest":         "UnitTest",
	"BaseHttpsServer":  "BaseHttpsServer",
	"SNIServer":        "SNIServer",
	"BeameSDKlauncher": "BeameSDKlauncher",
	"ProxyClient":      "ProxyClient",
	"Tunnel":           "Tunnel",
	"OpenSSL":          "OpenSSL",
	"AuthToken":        "AuthToken"
};

/**
 * Message Codes
 *  @enum {string}
 */
const MessageCodes = {
	"DebugInfo":           "DebugInfo",
	"EdgeLbError":         "EdgeLbError",
	"OpenSSLError":        "OpenSSLError",
	"ApiRestError":        "ApiRestError",
	"HostnameRequired":    "HostnameRequired",
	"MetadataEmpty":       "MetadataEmpty",
	"NodeFolderNotExists": "NodeFolderNotExists",
	"NodeFilesMissing":    "NodeFilesMissing",
	"CSRCreationFailed":   "CSRCreationFailed",
	"InvalidPayload":      "InvalidPayload",
	"SignerNotFound":      "SignerNotFound"
};


/**
 * Time units
 *  @enum {string}
 */
const TimeUnits = {
	"Second": "s",
	"Minute": "m",
	"Hour":   "h",
	"Day":    "d"
};

const CertValidationError = {
	"InFuture": "InFuture",
	"Expired":  "Expired"
};

/**
 * Log Event Codes
 *  @enum {string}
 */
const CDREvents = {
	// Keeper BeameAuth Router
	"AuthGetCredInfo":     "AuthGetCredInfo",
	"AuthRenewCert":       "AuthRenewCert",
	"AuthRegister":        "AuthRegister",
	"AuthCustomerApprove": "AuthCustomerApprove",
	"AuthSignup":          "AuthSignup",

	//Keeper Socket API Controller
	"LoginUser":     "LoginUser",
	"ChooseApp":     "ChooseApp",
	"Logout":        "Logout",
	"UpdateProfile": "UpdateProfile",

	// Keeper unauthenticated Router
	"ClientRegisterServer": "ClientRegisterServer",
	"ClientRecoverServer":  "ClientRecoverServer",
	"DirectSignin":         "DirectSignin",
	"GwAuthenticated":      "GwAuthenticated",
	"RedirectToHome":       "RedirectToHome",
	"RegisterCustomer":     "RegisterCustomer",
	"DownloadCred":         "DownloadCred",
	"DownloadIoSProfile":   "DownloadIoSProfile",

	//Keeper pairing utils
	"MobileVerifyToken":  "MobileVerifyToken",
	"MobileNotifyMobile": "MobileNotifyMobile"
};


/**
 * OCSP statuses
 *  @enum {string}
 */
const OcspStatus = {
	"Good":        "Good",
	"Revoked":     "Revoked", // revoked state from admin (sns revoked message) or from the ocsp call
	"Unavailable": "Unavailable"
};

const SNIServerPort = (process.env.SNI_SERVER_PORT > 0 && process.env.SNI_SERVER_PORT < 65536) ? process.env.SNI_SERVER_PORT : 0;

module.exports = {
	ActionsApi,
	AltPrefix,
	AppModules,
	ApprovedZones: ['beameio.net', 'beame.io'],
	AuthEventType,
	beameForceEdgeFqdn: SelectedProfile.ForceEdgeFqdn,
	beameForceEdgeIP: SelectedProfile.ForceEdgeFqdn,
	cdrDir: SelectedProfile.CdrDir,
	CDREvents,
	CertFileNames,
	CertResponseFields,
	CertValidationError,
	CredAction,
	credentialMetadataActionsLimit: 20,
	debugPrefix,
	defaultAllowedClockDiff: 100, //in seconds
	defaultAuthTokenTtl: 100, //in seconds
	defaultDays2Log: 7,
	defaultTimeFuzz: 10,
	defaultValidityPeriod: SelectedProfile.CertValidityPeriod,
	InitFirstRemoteEdgeClient: true,
	issuerCertsPath: path.join(SelectedProfile.Dir, 'issuer-certs-chain'),
	loadBalancerURL: "https://" + SelectedProfile.LoadBalancerFqdn,
	localCertsDirV2: path.join(SelectedProfile.Dir, 'v2'),
	LogEvents,
	LogFileNames,
	MessageCodes,
	metadataFileName: "metadata.json",
	MetadataProperties,
	npmRootDir,
	ocspCachePeriod: SelectedProfile.OcspCachePeriod,
	OcspStatus,
	PinAtomPKbyDefault: false,
	RegistrationSource,
	remotePKsDirV1: path.join(SelectedProfile.Dir, 'pki'),
	renewalCheckInterval: SelectedProfile.RenewalCheckInterval,
	renewalPercentageBeforeExpiration: SelectedProfile.RenewalPercentageBeforeExpiration,
	renewalBeforeExpirationMaxPeriod: SelectedProfile.RenewalBeforeExpirationMaxPeriod,
	RequestType,
	rootDir: SelectedProfile.Dir,
	s3MetadataFileName: "metadata.json",
	SelectedProfile,
	SNIServerPort,
	TimeUnits,
};
