import * as express from "express";
import LoanService from "@chitapp/api/services/loan";
import logger from "@chitapp/utils/logger";

export async function createLoan(req: express.Request, res: express.Response) {
  try {
    const s = await LoanService.createLoan(req.body);
    res.status(200).json({ id: s });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: error });
  }
}

export async function getAllLoans(req: express.Request, res: express.Response) {
  try {
    const response = await LoanService.getAllLoans();
    res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: error });
  }
}

export async function getLoansUser(
  req: express.Request,
  res: express.Response
) {
  try {
    const { user_id } = req.params;
    const response = await LoanService.getLoansOfUser(user_id);
    res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: error });
  }
}
