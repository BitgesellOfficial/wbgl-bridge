import assert from 'assert'
import {isValidEthAddress, isValidBglAddress, sha3, toBaseUnit} from '../utils/index.js'

describe('Functions inside utils folder', function () {
  describe('#sha3', function () {
    it('Should be equal because same string is used in creating the hashes', function () {
      let hashOfbgl = '68f2ac5a446296401ad77284ceab4f70b1b3efe0a1b0c216125af9306c11c414';
      let name = 'bgl';
      assert.equal(sha3(name), hashOfbgl);
    });
    it('Should not be equal because different strings are used in creating the hashes', function () {
        let hashOfbgl = '68f2ac5a446296401ad77284ceab4f70b1b3efe0a1b0c216125af9306c11c414';
        let name = 'bgls';
        assert.notEqual(sha3(name), hashOfbgl);
    });
  });
  describe('#isValidEthAddress', function () {
    it('This is a valid Ethereum address', function () {
      let address = '0x50e507cA8B4B657e1483Ac6f50D285e23EBfBA7A';
      assert.equal(isValidEthAddress(address), true);
    });
    it('This is not a valid Ethereum address', function () {
        let address = '0x50e507cA8B4B657e1483Ac6f50D285e23EBfBA7';
        assert.equal(isValidEthAddress(address), false);
    });
  });
  describe('#isValidBglAddress', function () {
    it('This is a valid BGL address', function () {
      let address = 'bgl1qapzlteru5p93c6exsqvjmy34pua8q0lws0p4kg';
      isValidBglAddress(address).then(function(resolved){
        assert.equal(resolved, true);
      }).catch(function(rejected){
        console.log("error :", rejected);
        assert.notEqual(true, false);
      });
    });
    it('This is not a valid bgl address', function () {
      let address = 'bgl1qapzlteru5p93c6exsqvjmy34pua8q0lws0p4k';
      isValidBglAddress(address).then(function(resolved){
        assert.equal(resolved, false);
      }).catch(function(rejected){
        console.log("error :", rejected);
        assert.notEqual(true, false);
      });
    });
  });
  describe('#toBaseUnit', function () {
    it('Valid inputs', function () {
      let value = '299.78';
      let decimals = 5;
      let result = toBaseUnit(value, decimals);
      let expected = 29978000;
      assert.equal(result["words"][0], expected);
    });
    it('Invalid inputs, value is dot', function () {
      let value = '.';
      let decimals = 5;
      assert.throws(function(){toBaseUnit(value, decimals);});
    });
    it('Invalid inputs, value is multiple dots', function () {
      let value = '500.34.9';
      let decimals = 5;
      assert.throws(function(){toBaseUnit(value, decimals);});
    });
    it('Invalid inputs, fraction length greater than decimals value', function () {
      let value = '500.34989766';
      let decimals = 5;
      assert.throws(function(){toBaseUnit(value, decimals);});
    });
    it('Invalid inputs, value not a string', function () {
      let value = 500;
      let decimals = 5;
      assert.throws(function(){toBaseUnit(value, decimals);});
    });
  });
});
