import * as express from "express";
import ChitService from "@chitapp/api/services/chit";
import logger from "@chitapp/utils/logger";

export async function createChit(req: express.Request, res: express.Response) {
  try {
    const s = await ChitService.createChit(req.body);
    res.status(200).json({ id: s });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: error });
  }
}

export async function getAllChits(req: express.Request, res: express.Response) {
  try {
    const response = await ChitService.getAllChits();
    res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: error });
  }
}

export async function getChitsUser(
  req: express.Request,
  res: express.Response
) {
  try {
    const { user_id } = req.params;
    const response = await ChitService.getChitsOfUser(user_id);
    res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: error });
  }
}

export async function chitMembersUpdate(
  req: express.Request,
  res: express.Response
) {
  try {
    const { chit_id, clients } = req.body;
    const response = await ChitService.chitMembersUpdate(chit_id, clients) as any;
    res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: error });
  }
}
