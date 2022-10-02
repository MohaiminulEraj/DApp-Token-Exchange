const { expect } = require('chai');
const { ethers} = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
}

describe('Token', () => {
    let token = '';

    beforeEach(async () => {
        // Fetch Token from Blockchain
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy('Anchor Token', 'ACTN', '10000000');
    })
    
    describe('Deployment', () => {

        const name = "Anchor Token";
        const symbol = "ACTN";
        const decimals = "18";
        const totalSupply = tokens("10000000");

        it('has correct name', async () => {
            // Check if the name is correct
            expect(await token.name()).to.equal(name);
        })
    
        it('has correct symbol', async () => {
            // Check if the symbol is correct
            expect(await token.symbol()).to.equal(symbol);
        })
    
        it('has correct decimals', async () => {
            // Check if the symbol is correct
            expect(await token.decimals()).to.equal(decimals);
        })
    
        it('has correct token supply', async () => {
            // Check if the total supply is correct
            expect(await token.totalSupply()).to.equal(totalSupply);
        })

    })
    
})