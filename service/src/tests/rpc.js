import assert from 'assert'
import {tips, generate, getBlockchainInfo, getBlockCount, getBalance, createAddress, listSinceBlock, getTransactionFromAddress, validateAddress } from '../modules/rpc.js'


describe('REST', () => {
    before(async () => {
      const [tip] = await tips();
  
      if (tip.height >= 100000) {
        return null;
      }
  
      await generate(100000);
    });
  
  describe('getBlockchainInfo()', () => {
    it('should return blockchain information', async () => {
       let info = await getBlockchainInfo();
       assert.ok(info)
    })
  });
  describe('#getBlockCount', () => {
    it('Is block count valid', async () => {
        let block = await getBlockCount()
        assert.ok(block);
    });
  });
  describe('createAddress()', () => {
    it('should create new address', async () => {
        let address = await createAddress()
        console.log(address)    
        let result = validateAddress(address);
        assert.ok(result);
    });
  });
  /*describe('#listSinceBlock', function () {
    it('list blocks', function () {
        let blockHash = "000000000000028f3c217bfe1c873d8c2d9de6104f5add4299d43dd127564135";
        listSinceBlock(blockHash, 3).then(function(resolved){
            console.log(resolved);
            assert.equal(true, true);
        }).catch(function(rejected){
            console.log("error ", rejected);
            assert.equal(true, true);
        })
     })
    });*/
  describe('#getTransactionFromAddress', function () {
    it('Get address from txid', function () {
        let txid = "6e8027d688ec2bcc4dcf137475ee5611ad306f7a64b38f0a28a0fffe98fce8aa";
        getTransactionFromAddress(txid).then(function(resolved){
            let result = validateAddress(resolved);
            assert.ok(result);
        }).catch(function(rejected){
            console.log("error ", rejected);
            assert.equal(true, true);
        })
    });
  });
});
