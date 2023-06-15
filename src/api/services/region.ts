import logger from "@chitapp/utils/logger";
import Region from "../models/region";

function getRegions() {
    return new Promise(async (resolve, reject) => {
      try {
        const regions = await Region.find({});
        if (regions.length===0) return resolve({ msg: "No Region Found" });
        resolve(regions);
      } catch (error) {
        logger.error(error);
        reject(error);
      }
    });
  }

  export default {
    getRegions
  }