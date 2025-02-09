const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault 2", () => {
	beforeEach(async () => {
		Vault2 = await ethers.getContractFactory("Vault2");
		[owner] = await ethers.getSigners();

		vault2 = await Vault2.deploy();

		await vault2.deployed();
	});

	describe("mint", function() {
		it("should mint with exactly amount of ether sent", async function () {
			await expect(
				vault2.mint(1000, { value: 1000 })
			).to.emit(vault2, "Minted").withArgs(owner.address, 1000);
		});

		it("should not mint with more ether sent", async function () {
			await expect(
				vault2.mint(1000, { value: 1001 })
			).to.be.revertedWith("Must send exactly the same amount of ether.");
		});

		it("should not mint with less ether sent", async function () {
			await expect(
				vault2.mint(1000, { value: 999 })
			).to.be.revertedWith("Must send exactly the same amount of ether.");
		});

		it("should not mint zero", async function () {
			await expect(
				vault2.mint(0)
			).to.be.revertedWith("Must mint a non-zero value.");
		});
	});

	describe("burn", function() {
		it("should burn if balance is sufficient", async function () {
			initialBalance = await owner.getBalance();

			ether = ethers.utils.parseEther("1");
			await vault2.mint(ether.mul(100), { value: ether.mul(100) });
			await expect(
				vault2.burn(ether.mul(50))
			).to.emit(vault2, "Burned").withArgs(owner.address, ether.mul(50));

			// Final balance should be initialBalance - 50eth, minus gas (which should be within 0.001 eth).
			expect(await owner.getBalance()).to.be.closeTo(
				initialBalance.sub(ether.mul(50)),
				ethers.utils.parseEther("0.001"));
		});

		it("should not burn if balance is insufficient", async function () {
			await vault2.mint(1000, { value: 1000 });
			await expect(
				vault2.burn(1001)
			).to.be.revertedWith("ERC20: burn amount exceeds balance");
		});

		it("should not burn zero", async function () {
			await expect(
				vault2.burn(0)
			).to.be.revertedWith("Must burn a non-zero value.");
		});
	});
});
