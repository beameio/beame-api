//
// Created by Zeev Glozman
// Beame.io Ltd, 2016.
//
/*jshint esversion: 6 */

var async         = require('async');
//var exec        = require('child_process').exec;
var _             = require('underscore');
var os            = require('os');
var config        = require('../../config/Config');
const module_name = config.AppModules.BeameStore;
var logger        = new (require('../utils/Logger'))(module_name);
var jmespath      = require('jmespath');
var beameDirApi   = require('./BeameDirServices');
var sprintf       = require('sprintf');
var mkdirp        = require('mkdirp');
var path          = require('path');
var request       = require('sync-request');
var url           = require('url');
var BeameStoreDataServices = require('../services/BeameStoreDataServices');


class Credential{
	constructor(fqdn, parentFqdn){
		this.fqdn = fqdn;
		this.state = config.CREDENTIAL_STATUS.DIR_NOTREAD;
		this.parent_fqdn = parentFqdn;
		this.dirShaStatus = "";
		determineCertStatus();
		this.dataHelper = new BeameStoreDataServices(this.fqdn);
	}
	//
	// this function will scan the beamedis of the this.fqdn this is not intended to be used directly.
	//

	determineCertStatus(){



			if(dirShaStatus && dirShaStatu.lenght !== 0){
				//
				// This means this is a brand new object and we dont know anything at all
				this.credentials = this.readCertificateDir();

			}
			if(this.doesHaveX509()){
				this.state = this.state | config.CREDENTIAL_STATUS.CERT;
			}

			if(this.state & config.CREDENTIAL_STATUS.CERT && this.extractCommonName().indexOf("beameio.net")){
				this.state = this.state | config.CREDENTIAL_STATUS.BEAME_ISSUED_CERT;
				this.state = this.state & config.CREDENTIAL_STATUS.NON_BEAME_CERT;
			}else{

				this.state = this.state | config.CREDENTIAL_STATUS.BEAME_ISSUED_CERT;
				this.state = this.state & config.CREDENTIAL_STATUS.NON_BEAME_CERT;
			}

			if(this.doesHavePrivateKey()){
				this.state = this.state & config.CREDENTIAL_STATUS.PRIVATE_KEY;
			}else{
				this.state = this.state | config.CREDENTIAL_STATUS.PRIVATE_KEY;
			}
	};

	loadCredentialsObject(){
		var credentials = {};
		this.state = this.state | config.CREDENTIAL_STATUS.DIR_NOTREAD;

		_.map(config.certificatefiles, function (key, value) {
			try {
				this.value = this.dataHelper.readObject(key);
			}
			catch (e) {
				logger.debug("readcertdata error " +  e.tostring());
			}
		});

		credentials.path = certificatesDir;

		try {
			this.dataHelper.readObject(config.metadatafilename);
			//noinspection es6modulesdependencies,nodemodulesdependencies
			_.map(json.parse(filecontent), function (key, value) {
				this.value.credentials[value] = key;
			});
		} catch (e) {
			logger.debug("readcertdata error " + e.tostring());
		}
	};


	doesHavePrivateKey(){
		this.PRIVATE_KEY && return true;
		return false;
	};

	doesHaveX509(){
		this.X509 && return true;
		return false;
	}

	extractCommonName(){
		var xcert = x509.parseCert(cert + "");
		if (xcert) {}
	}

	extractAltNames(){

	}

	getPublicKey(){
		var xcert = x509.parseCert(cert + "");
		if (xcert) {
			var publicKey = xcert.publicKey;
			var modulus = new Buffer(publicKey.n, 'hex');
			var header = new Buffer("MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA", "base64");
			var midheader = new Buffer("0203", "hex");
			var exponent = new Buffer("010001", "hex");
			var buffer = Buffer.concat([header, modulus, midheader, exponent]);
			var rsaKey = new NodeRsa(buffer, "public-der");
			rsaKey.importKey(buffer, "public-der");
			return rsaKey;
		}
		return {};
	}

	sign(){

	}
}

