// eslint-disable-next-line no-undef
const Migrations = artifacts.require('Migrations');

module.exports = function deployer(deployer) {
    deployer.deploy(Migrations)
};