import logger from "@chitapp/utils/logger";
import Transaction, { ITransaction } from "@chitapp/api/models/transaction";
import User from "../models/user";

function createTransaction(body: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        _id,
        transaction_number,
        client,
        region,
        agent,
        received_amount,
        received_date,
        agent_id,
        type,
        transaction_type,
        settlement,
        transaction_for,
      } = body;

      let transaction = new Transaction({
        transaction_number,
        client,
        region,
        agent,
        received_amount,
        received_date,
        agent_id,
        type,
        transaction_type,
        settlement,
        transaction_for,
      });

      if(_id !== undefined){
        const old = await Transaction.findById(_id);
        if(old){
          transaction = old;
          transaction.settlement = settlement;
          transaction.transaction_for = transaction_for;
        }
      }

      const transactionResponse = await transaction.save();
      resolve(transactionResponse.id);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  });
}

function getTransactionsUser(transaction_number: string, user_id: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const transactions = await Transaction.find({
        transaction_number,
        "client.id": user_id,
      }).sort({ received_date: -1 });
      if (!transactions) return resolve([]);
      if (transactions.length === 0) return resolve([]);
      resolve(transactions);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  });
}

function getTransactionsOfAgentOnDate(agent_id: string, date: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const received_date = new Date(date);
      const filteredResponse: any[] = [];
      const transactions = await Transaction.find({ agent_id });
      if (!transactions) return resolve([]);
      if (transactions.length === 0) return resolve([]);
      transactions.forEach((t) => {
        if (t.received_date.toDateString() === received_date.toDateString()) {
          filteredResponse.push(t);
        }
      });
      resolve(filteredResponse);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  });
}

function getWithdrawal(transaction_number: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const responseTransactions = [];
      const transactions = await Transaction.find({
        transaction_type: "withdrawal",
        transaction_number,
      }).sort({ received_date: -1 });
      if (!transactions) return resolve([]);
      if (transactions.length === 0) return resolve([]);
      for await (const t of transactions) {
        const client = await User.findById(t.client.id);
        const agent = await User.findById(t.agent.id);
        const transactionObject = {
          _id: t._id,
          transaction_number: t.transaction_number,
          received_amount: t.received_amount,
          received_date: t.received_date,
          type: t.type,
          client,
          agent,
        };
        responseTransactions.push(transactionObject);
      }
      resolve(responseTransactions);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  });
}

function filterTransactions(type: string, from_date: string, to_date: string) {
  return new Promise(async (resolve, reject) => {
    try {
      let transactions: ITransaction[] = [];
      if (to_date === "none") {
        transactions = await Transaction.find();
        transactions = transactions.filter(
          (x) =>
            x.received_date.toDateString() ===
            new Date(from_date).toDateString()
        );
      } else {
        transactions = await Transaction.find({
          received_date: { $gte: new Date(from_date), $lte: new Date(to_date) },
        });
      }
      if (!transactions) return resolve([]);
      if (transactions.length === 0) return resolve([]);
      const allAgents = await User.find().or([
        { type: "agent" },
        { type: "admin" },
      ]);
      if (allAgents.length > 0) {
        // agent wise
        if (type === "agent") {
          const agentList: any[] = [];
          let count = 0;
          allAgents.forEach((singleAgent) => {
            count++;
            const agentObject = {
              _id: singleAgent.id,
              count,
              name: singleAgent.name,
              collected: 0,
              settled: 0,
              balance: 0,
              isAdmin: false,
              details: [] as ITransaction[],
            };
            transactions.forEach((responseTransaction) => {
              if (responseTransaction.agent.id === singleAgent.id ) {
                if(responseTransaction.type === "settlement"){
                  agentObject.settled += responseTransaction.received_amount;
                } else if(responseTransaction.type === "chit" || responseTransaction.type === "loan") {
                  const adminArr = allAgents.filter((item : any) => (item._id.toString() === responseTransaction.agent.id &&  item.type === "admin" ));
                  if(adminArr.length){
                    agentObject.isAdmin = true;
                    agentObject.settled += responseTransaction.received_amount;
                  }
                  agentObject.collected += responseTransaction.received_amount;
                }
                agentObject.details.push(responseTransaction);
              }
            });
            agentObject.balance = agentObject.collected - agentObject.settled;
            agentList.push(agentObject);
          });
          return resolve(agentList);
        }
      } else {
        return resolve([]);
      }
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  });
}

function getAllTransactionsOfAgent(agent_id: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const transactions = await Transaction.find({ "agent.id": agent_id });
      if (!transactions) return resolve([]);
      if (transactions.length === 0) return resolve([]);
      resolve(transactions);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  });
}

export default {
  createTransaction,
  getTransactionsUser,
  getTransactionsOfAgentOnDate,
  getWithdrawal,
  filterTransactions,
  getAllTransactionsOfAgent,
};
