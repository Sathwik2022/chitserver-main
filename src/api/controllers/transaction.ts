import * as express from "express";
import TransactionService from "@chitapp/api/services/transaction";
import logger from "@chitapp/utils/logger";

export async function createTransaction(
  req: express.Request,
  res: express.Response
) {
  try {
    const id = await TransactionService.createTransaction(req.body);
    res.status(200).json({ id });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: error });
  }
}

export async function getTransactionsUser(
  req: express.Request,
  res: express.Response
) {
  try {
    const { transaction_number, user_id } = req.params;
    const response = await TransactionService.getTransactionsUser(
      transaction_number,
      user_id
    );
    res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: error });
  }
}

export async function getTransactionsOfAgentOnDate(
  req: express.Request,
  res: express.Response
) {
  try {
    const { agent_id, date } = req.params;
    const response = await TransactionService.getTransactionsOfAgentOnDate(
      agent_id,
      date
    );
    res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: error });
  }
}

export async function getWithdrawal(
  req: express.Request,
  res: express.Response
) {
  try {
    const { transaction_number } = req.params;
    const response = await TransactionService.getWithdrawal(transaction_number);
    res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: error });
  }
}

export async function filterTransactions(
  req: express.Request,
  res: express.Response
) {
  try {
    const { type, from_date, to_date } = req.params;
    const response = await TransactionService.filterTransactions(
      type,
      from_date,
      to_date
    );
    res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: error });
  }
}

export async function getAllTransactionsOfAgent(
  req: express.Request,
  res: express.Response
) {
  try {
    const { agent_id } = req.params;
    const response = await TransactionService.getAllTransactionsOfAgent(
      agent_id
    );
    res.status(200).json(response);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: error });
  }
}
