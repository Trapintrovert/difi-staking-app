pragma solidity ^0.5.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank {
    string public name = 'Decentra Bank';
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }
    
    function depositToken(uint _amount) public{
        // require stking amount to be greater than zero
        require(_amount > 0, 'amount cannot be 0');

        // Transfer tether tokens to this contract address for sraking
        tether.transferFrom(msg.sender, address(this), _amount);

        // update staking balance 
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        //Updating staking balance
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // unstaken token
    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        // require the amount is greater than zero
        require(balance > 0, 'staking balance cant be less than zero');

        // transfer the tokens to the specified contract address from our bank
        tether.transfer(msg.sender, balance);

        // reset staking balance
        stakingBalance[msg.sender] = 0;

        // update staking status
        isStaking[msg.sender] = false;

    }

    // issue rewards
    function issueTokens() public {
        // require the owner to issue tokens only
        require(msg.sender == owner, 'caller must be the owner');

        for (uint i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient] / 9; // / 9 to create percentage incentives for stakers
            if(balance > 0) {
                rwd.transfer(recipient, balance);
            }
        }
    }
}