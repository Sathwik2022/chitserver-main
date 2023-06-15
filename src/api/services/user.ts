import User from "@chitapp/api/models/user";
import logger from "@chitapp/utils/logger";
import jwt, { VerifyErrors } from "jsonwebtoken";

function createAuthToken(
  userId: string
): Promise<{ token: string; expireAt: Date }> {
  return new Promise(function (resolve, reject) {
    jwt.sign(
      { userId: userId },
      "privateSecret@1235",
      (err: Error | null, encoded: string | undefined) => {
        if (err === null && encoded !== undefined) {
          const expireAfter = 2 * 604800; /* two weeks */
          const expireAt = new Date();
          expireAt.setSeconds(expireAt.getSeconds() + expireAfter);

          resolve({ token: encoded, expireAt: expireAt });
        } else {
          reject(err);
        }
      }
    );
  });
}

async function auth(bearerToken: string) {
  if (!bearerToken)
    return { error: { type: "unauthorized", message: "ACCESS DENIED" } };
  const token = bearerToken.replace("Bearer ", "");
  return new Promise(function (resolve, reject) {
    try {
      const decoded = jwt.verify(token, "privateSecret@1235");
      resolve(decoded);
    } catch (error: any) {
      reject(error.message);
    }
  });
}

async function login(contact_number: string, password: string) {
  try {
    const user = await User.findOne({ contact_number });
    if (!user) {
      return {
        error: {
          type: "invalid_credentials",
          message: "Invalid Login/Password",
        },
      };
    }
    if (user.disabled) {
      return {
        error: {
          type: "disabled",
          message: "User disabled by Admin",
        },
      };
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return {
        error: {
          type: "invalid_credentials",
          message: "Invalid Login/Password",
        },
      };
    }

    const authToken = await createAuthToken(user._id.toString());
    return {
      user,
      token: authToken.token,
      expireAt: authToken.expireAt,
    };
  } catch (err) {
    logger.error(`login: ${err}`);
    return Promise.reject({
      error: {
        type: "internal_server_error",
        message: "Internal Server Error",
      },
    });
  }
}

// CREATE A SINGLE USER
function createUser(body: any) {
  return new Promise((resolve, reject) => {
    try {
      const {
        password,
        email,
        name,
        contact_number,
        type,
        region,
        address,
        pan,
        aadhar_number,
        date_of_birth,
        photo,
        joining_date,
        account_number,
        witness_1,
        contact_number_witness_1,
        witness_2,
        contact_number_witness_2,
      } = body;
      const user = new User({
        password,
        email,
        name,
        contact_number,
        type,
        region,
        address,
        pan,
        aadhar_number,
        date_of_birth: new Date(date_of_birth),
        photo,
        joining_date,
        disabled: type === "agent" ? false : undefined,
        account_number: type === "customer" ? account_number : undefined,
        witness_1: type === "customer" ? witness_1 : undefined,
        contact_number_witness_1: type === "customer" ? contact_number_witness_1 : undefined,
        witness_2: type === "customer" ? witness_2 : undefined,
        contact_number_witness_2: type === "customer" ? contact_number_witness_2 : undefined,
      });

      if(type === "customer"){
        if(account_number === "" || witness_1 === "" || contact_number_witness_1 === "" || witness_2 === "" || contact_number_witness_2 === "") {
          logger.error("All Fields With * Are Mandatory");
          reject("All Fields With * Are Mandatory");
        }
      }

      user
        .save()
        .then((user) => {
          resolve(user.id);
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

function updateUser(body: any) {
  return new Promise((resolve, reject) => {
    try {
      const {
        password,
        email,
        name,
        contact_number,
        type,
        region,
        address,
        pan,
        aadhar_number,
        date_of_birth,
        joining_date,
        id,
      } = body;
      User.findById(id)
        .then((user) => {
          if (user) {
            user.password = password;
            user.email = email;
            user.name = name;
            user.contact_number = contact_number;
            user.type = type;
            user.region = region;
            user.pan = pan;
            user.address = address;
            user.aadhar_number = aadhar_number;
            user.date_of_birth = new Date(date_of_birth);
            user.joining_date = joining_date;

            user
              .save()
              .then((_) => resolve(`user ${id} updated`))
              .catch((err) => {
                logger.error(err);
                reject(err);
              });
          } else reject("No USER");
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

// GET A SINGLE USER WITH ID
function getSingleUser(user_id: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(user_id);
      if (!user) return resolve({ msg: "No User Found" });
      resolve(user);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  });
}

// GET ALL USERS OF TYPE
function getUsers(type: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await User.find({ type });
      if (!users) return resolve([]);
      if (users.length === 0) return resolve([]);
      resolve(users);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  });
}

// Toggle Disable User
function toggleDisableUser(user_id: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(user_id);
      if (!user) return resolve("No User");
      user.disabled = !user.disabled;
      await user.save();
      return resolve("done");
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  });
}

function getCustomersOfRegion(region: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await User.find({ region, type: "customer" });
      if (users.length === 0) return resolve("No Users");
      return resolve(users);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  });
}

function getAgentsOfRegion(region: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await User.find({ region, type: "agent" });
      if (users.length === 0) return resolve("No Users");
      return resolve(users);
    } catch (error) {
      logger.error(error);
      reject(error);
    }
  });
}

export default {
  auth,
  login,
  createUser,
  updateUser,
  getSingleUser,
  getUsers,
  toggleDisableUser,
  getCustomersOfRegion,
  getAgentsOfRegion,
};
