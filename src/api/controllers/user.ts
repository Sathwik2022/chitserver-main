import * as express from "express";
import UserService from "@chitapp/api/services/user";
import logger from "@chitapp/utils/logger";

export async function auth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const token = req.headers.authorization!;
    const authResponse = await UserService.auth(token);
    if ((authResponse as any).error) {
      return res.status(500).json(authResponse);
    }
    res.locals.auth = (authResponse as any as { user_id: string }).user_id;
    next();
  } catch (error) {
    logger.error(error);
    if (error === "invalid signature") {
      return res.status(200).json({ msg: "INVALID TOKEN" });
    }
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function login(req: express.Request, res: express.Response) {
  try {
    const { contact_number, password } = req.body;
    const response = await UserService.login(contact_number, password);
    res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: error });
  }
}

export async function createUser(req: express.Request, res: express.Response) {
  try {
    const s = await UserService.createUser(req.body);
    res.status(200).json({ id: s });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: error });
  }
}

export async function updateUser(req: express.Request, res: express.Response) {
  try {
    const s = await UserService.updateUser(req.body);
    res.status(200).json({ id: s });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: error });
  }
}

export async function getSingleUser(
  req: express.Request,
  res: express.Response
) {
  try {
    const { user_id } = req.params;
    const response = await UserService.getSingleUser(user_id);
    res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: error });
  }
}

export async function getUsers(req: express.Request, res: express.Response) {
  try {
    const { type } = req.params;
    const response = await UserService.getUsers(type);
    res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: error });
  }
}

export async function toggleDisableUser(
  req: express.Request,
  res: express.Response
) {
  try {
    const { user_id } = req.body;
    const response = await UserService.toggleDisableUser(user_id);
    res.status(200).json({ msg: response });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: error });
  }
}

export async function getCustomersOfRegion(
  req: express.Request,
  res: express.Response
) {
  try {
    const { region } = req.params;
    const response = await UserService.getCustomersOfRegion(region);
    res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: error });
  }
}

export async function getAgentsOfRegion(
  req: express.Request,
  res: express.Response
) {
  try {
    const { region } = req.params;
    const response = await UserService.getAgentsOfRegion(region);
    res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: error });
  }
}
