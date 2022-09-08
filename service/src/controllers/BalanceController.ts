import {Request, Response} from 'express'
import { Bsc, Eth, RPC } from "../modules";

export const bgl = async (_req: Request, res: Response) =>
  res.json(Math.floor(await RPC.getBalance()));
export const eth = async (_req: Request, res: Response) =>
  res.json(parseInt(await Eth.getWBGLBalance()));
export const bsc = async (_req: Request, res: Response) =>
  res.json(parseInt(await Bsc.getWBGLBalance()));
