// eslint-disable-next-line no-undef
const Tether = artifacts.require('Tether')
// eslint-disable-next-line no-undef
const RWD = artifacts.require('RWD')
// eslint-disable-next-line no-undef
const DecentralBank = artifacts.require('DecentralBank')

module.exports = async function deployer(deployer) {
    // Deploy Mock Tether Contract
    await deployer.deploy(Tether)

    // Deploy RWD Contract
    await deployer.deploy(RWD)

    // Deploy DecentralBank Contract
    await deployer.deploy(DecentralBank)
};