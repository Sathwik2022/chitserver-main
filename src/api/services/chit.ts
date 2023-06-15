import logger from "@chitapp/utils/logger";
import Chit from "@chitapp/api/models/chit";

function createChit(body: any) {
  return new Promise((resolve, reject) => {
    try {
      const {
        name,
        chit_number,
        clients,
        amount,
        start_date,
        number_of_installments,
        installment_amount,
      } = body;
      const chit = new Chit({
        name,
        chit_number,
        clients,
        amount,
        start_date: new Date(start_date),
        number_of_installments,
        installment_amount,
      });
      chit
        .save()
        .then((chit) => {
          resolve(chit.id);
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

// GET ALL CHITS
function getAllChits() {
  return new Promise(async (resolve, reject) => {
    try {
      const chits = await Chit.find({}).sort({ start_date: -1 });
      if (!chits) return resolve([]);
      if (chits.length === 0) return resolve([]);
      resolve(chits);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  });
}

// GET CHITS OF A PARTICULAR USER
function getChitsOfUser(user_id: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const chits = await Chit.find({ clients: user_id });
      if (!chits) return resolve([]);
      if (chits.length === 0) return resolve([]);
      resolve(chits);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  });
}

function chitMembersUpdate(chit_id: string, clients: []) {
  return new Promise(async (resolve, reject) => {
    try {
      const chit = await Chit.findById(chit_id);
      if (!chit) return resolve("NO CHIT");
      chit.clients = clients;
      await chit.save();
      return resolve(chit);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  });
}

export default {
  createChit,
  getChitsOfUser,
  getAllChits,
  chitMembersUpdate
};
