const { expect } = require('chai');
const { ethers} = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
}

describe('Token', () => {
    let token, accounts, deployer, receiver = '';

    beforeEach(async () => {
        // Fetch Token from Blockchain
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy('Anchor Token', 'ACTN', '10000000');
        accounts = await ethers.getSigners();        
        deployer = accounts[0];
        receiver = accounts[1];
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

        it('assigns total supply to deployer', async () => {
            expect(await token.balanceOf(deployer.address)).to.equal(totalSupply);
        })

    })
    
    describe('Sending Tokens', () => {
        let amount, transaction, result = 0;
        describe('Success', () => {
            beforeEach(async () => {
                amount = tokens(100);
                transaction = await token.connect(deployer).transfer(receiver.address, amount);
                result = await transaction.wait();
            })
            it('transfers token balances', async () => {
                expect(await token.balanceOf(deployer.address)).to.equal(tokens(9999900))
                expect(await token.balanceOf(receiver.address)).to.equal(tokens(100))
            })
    
            it('emits a Transfer event', async () => {
                const event = result.events[0];
                expect(event.event).to.equal('Transfer');
    
                const args = event.args;
                expect(args.from).to.equal(deployer.address)
                expect(args.to).to.equal(receiver.address)
                expect(args.value).to.equal(amount)
            })
        })

        describe('Failure', () => {
            it('rejects insufficient balances', async () => {
                // Transfer more tokens than deployer has - 100M
                const invalidAmount = tokens(100000000)
                await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted
            })
            
            it('rejects invalid recipent', async () => {
                const amount = tokens(100)
                await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
              })
        })
    })
})