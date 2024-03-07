import mongoose from "mongoose"
import { MONGODB_CONST } from "./connectMongoDb.const"
export const connectDb = async () => {
  try {
    console.log(MONGODB_CONST.DATABASE_URL)
    if (!process.env.DATABASE_URL)
      throw Error(`${MONGODB_CONST.MONGODB_FAILED_MESSAGE}`.bgRed)
    await mongoose.connect(MONGODB_CONST.DATABASE_URL)
    console.log(`${MONGODB_CONST.MONGODB_SUCCESS_MESSAGE}`.blue)
  } catch (error) {
    if (error instanceof Error) console.log(error.message.red)
  }
}
export default connectDb