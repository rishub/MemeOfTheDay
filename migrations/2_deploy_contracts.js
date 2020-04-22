const Hash = artifacts.require("Hash");

module.exports = function(deployer) {
	deployer.deploy(Hash);
};
