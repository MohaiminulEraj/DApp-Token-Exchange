const { ethers } = require("hardhat");
const { etherscan } = require("../hardhat.config");

async function main() {
    // Fetch Contract to deploy
    const Token = await ethers.getContractFactory("Token");
    // Deploy Contract
    const token = await Token.deploy();
    // get the token info that is currently deployed
    await token.deployed();
    console.log(`Token Deployed to: ${token.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})