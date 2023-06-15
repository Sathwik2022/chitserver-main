import logger from "@chitapp/utils/logger";
import Loan from "@chitapp/api/models/loan";

function createLoan(body: any) {
  return new Promise((resolve, reject) => {
    try {
      const {
        loan_number,
        region,
        amount,
        payable,
        issued_date,
        repayment_type,
        client,
        agent,
      } = body;
      const loan = new Loan({
        loan_number,
        region,
        amount,
        payable,
        issued_date: new Date(issued_date),
        repayment_type,
        client,
        agent,
      });
      loan
        .save()
        .then((loan) => {
          resolve(loan.id);
        })
        .catch((err) => {
          logger.error(err);
          reject(err);
        });
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  });
}

// GET ALL LOANS
function getAllLoans() {
  return new Promise(async (resolve, reject) => {
    try {
      const loans = await Loan.find({}).sort({ issued_date: -1 });
      if (!loans) return resolve([]);
      if (loans.length === 0) return resolve([]);
      resolve(loans);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  });
}

// GET LOANS OF A PARTICULAR USER
function getLoansOfUser(user_id: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const loans = await Loan.find({ "client.id": user_id });
      if (!loans) return resolve([]);
      if (loans.length === 0) return resolve([]);
      resolve(loans);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  });
}

export default {
  createLoan,
  getLoansOfUser,
  getAllLoans,
};
