const { assert } = require('chai')

// eslint-disable-next-line no-undef
const Tether = artifacts.require('Tether')
// eslint-disable-next-line no-undef
const RWD = artifacts.require('RWD')
// eslint-disable-next-line no-undef
const DecentralBank = artifacts.require('DecentralBank')


require('chai')
.use(require('chai-as-promised'))
.should()

// eslint-disable-next-line no-undef
contract('DecentralBank', ([owner, customer]) => {
    // ALL of the code goes here for testing

    let tether, rwd, decentralBank;

    function tokens(number){
        // eslint-disable-next-line no-undef
        return  web3.utils.toWei(number, 'ether')
    }

    // eslint-disable-next-line no-undef
    before(async () => {
        // Load contract
        tether = await Tether.new()
        rwd = await RWD.new()
        decentralBank = await DecentralBank.new(rwd.address, tether.address)

        //Transfer all tokens to DecentralBank (1 million)
        await rwd.transfer(decentralBank.address, tokens('1000000'))

        //Transfer 100 mock Tether to Customer
        await tether.transfer(customer, tokens('100'), {from: owner})
    })


    describe('Mock Tether Deployment', async () => {
        it('matches name successfully ', async () => {
            const name = await tether.name()
            assert.equal(name, 'Mock Tether Token')
        })
    })


    describe('Reward Token Deployment', async () => {
        it('matches name successfully ', async () => {
            
            const name = await rwd.name()
            assert.equal(name, 'Reward Token')
        })
    })

    describe('Central Bank Deployment', async () => {
        it('matches name successfully ', async () => {
            
            const name = await decentralBank.name()
            assert.equal(name, 'Decentra Bank')
        })

        it('contract has tokens', async () => {
            let balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, tokens('1000000'))
        })

        describe('Yield farming', async () => {
            it('rewards token for staking', async() => {
                let result;

                //Check Investor Balance
                result = await tether.balanceOf(customer)
                assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance before staking')
                
                // check updated staking customer
                await tether.approve(decentralBank.address, tokens('100'), {from: customer})
                await decentralBank.depositTokens(tokens('100'), { from: customer})

                //Check Investor Balance
                result = await tether.balanceOf(decentralBank.address)
                assert.equal(result.toString(), tokens('0'), 'customer mock wallet balance after staking 100 tokens')
                                
                // Check updated balance of customer
                result = await decentralBank.stakingBalance(customer)
                assert.equal(result.toString(), tokens('100'), 'decentral bank mock wallet balance after staking from customer')
                 
                // Is staking balance
                result =  await decentralBank.isStaking(customer)
                assert.equal(result.toString(), true, 'customer is staking status after staking')

                // Issue Token
                await decentralBank.issueTokens({from:owner})

                // Ensure only the owner can issue token
                await decentralBank.issueTokens({from: customer}).should.be.rejected;

                // Unstake token
                await decentralBank.unstakeTokens({from: customer})

                // Check Unstaking Balance
                 result = await tether.balanceOf(decentralBank.address)
                 assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance after staking 100 tokens')
                                 
                 // Check updated balance of customer
                 result = await decentralBank.stakingBalance(customer)
                 assert.equal(result.toString(), tokens('0'), 'decentral bank mock wallet balance after staking from customer')
                  
                 // Is staking balance
                 result =  await decentralBank.isStaking(customer)
                 assert.equal(result.toString(), false, 'customer is staking status after unstaking')
            })

        })
    })
})


