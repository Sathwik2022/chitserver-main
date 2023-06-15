import * as express from "express";
import logger from "@chitapp/utils/logger";
import RegionService from "@chitapp/api/services/region";

export async function getRegions(req: express.Request, res: express.Response) {
  try {
    const response = await RegionService.getRegions();
    res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: error });
  }
}
