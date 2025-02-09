//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Wrapper.sol";

contract Vault1 is ERC20Wrapper {
    event Deposited(address owner, uint amount);
    event Withdrawn(address owner, uint amount);

    constructor(IERC20 underlyingToken) 
        ERC20Wrapper(underlyingToken) 
        ERC20("Vault1", "VALT1") {}

    function deposit(uint _amount) public {
        depositFor(msg.sender, _amount);
        emit Deposited(msg.sender, _amount);
    }

    function withdraw(uint _amount) public {
        withdrawTo(msg.sender, _amount);
        emit Withdrawn(msg.sender, _amount);
    }
}
