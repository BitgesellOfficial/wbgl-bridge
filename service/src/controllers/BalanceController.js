import {Bsc, Eth, RPC} from '../modules/index.js'

export const bgl = async (_req, res) => res.json(Math.floor(await RPC.getBalance()))
export const eth = async (_req, res) => res.json(parseInt(await Eth.getWBGLBalance()))
export const bsc = async (_req, res) => res.json(parseInt(await Bsc.getWBGLBalance()))
