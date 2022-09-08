import Web3 from "web3";
import BN from 'bn.js'

import { RPC } from "../modules/index";

type Address = string

export const isValidEthAddress = (address: Address) =>
  /^0x[a-fA-F0-9]{40}$/i.test(address);

export const isValidBglAddress = async (address: Address) =>
  RPC.validateAddress(address);

export const sha3 = (value: string | BN): string =>  Web3.utils.sha3(value).substring(2);

const bn = Web3.utils.toBN;

export function isString(s: any) {
  return typeof s === "string" || s instanceof String;
}

export function toBaseUnit(value: string, decimals: number): BN {
  if (!isString(value)) {
    throw new Error("Pass strings to prevent floating point precision issues.");
  }
  const ten = bn(10);
  const base = ten.pow(bn(decimals));

  // Is it negative?
  let negative = value.substring(0, 1) === "-";
  if (negative) {
    value = value.substring(1);
  }

  if (value === ".") {
    throw new Error(
      `Invalid value ${value} cannot be converted to` +
        ` base unit with ${decimals} decimals.`,
    );
  }

  // Split it into a whole and fractional part
  let comps = value.split(".");
  if (comps.length > 2) {
    throw new Error("Too many decimal points");
  }

  let whole: string | BN = comps[0],
    fraction: string | BN = comps[1];

  if (!whole) {
    whole = "0";
  }
  if (!fraction) {
    fraction = "0";
  }
  if (fraction.length > decimals) {
    throw new Error("Too many decimal places");
  }

  while (fraction.length < decimals) {
    fraction += "0";
  }

  whole = bn(whole);
  fraction = bn(fraction);
  let wei = whole.mul(base).add(fraction);

  if (negative) {
    wei = wei.neg();
  }

  return bn(wei.toString(10));
}
