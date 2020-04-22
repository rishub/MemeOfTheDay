const Hash = artifacts.require("Hash");

require("chai")
	.use(require("chai-as-promised"))
	.should();

contract("Hash", accounts => {
	let hash;

	describe("deployment", async () => {
		it("deploys successfully", async () => {
			hash = await Hash.deployed();
			const address = hash.address;
			assert.notEqual(address, "");
			assert.notEqual(address, null);
			assert.notEqual(address, undefined);
		})
	})

	describe("storage", async () => {
		it("updates the hash", async () => {
			let memeHash;
			memeHash = "abc123";
			await hash.set(memeHash);
			const result = await hash.get();
			assert.equal(result, memeHash);
		})
	})
})
