import express, { Application } from "express"
import cors from "cors"
import bodyParser from "body-parser"
import "colors"
require("dotenv").config()
import router from "../api"
import { CONFIG_CONST } from "./config.const"
import connectMongoDb from "../database/mongodb/connectMongoDb"


/**
 * Configure and start the Express application.
 */
const config = () => {
  const app: Application = express()
  connectMongoDb()
  app.use(
    bodyParser.json({
      verify: (req: any, res: any, buf: any, encoding: any) => {
        if (buf && buf.length) {
          req.rawBody = buf.toString(encoding || "utf8")
        }
      },
    })
  )
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cors())
  app.use("/api", router)
  app.listen(CONFIG_CONST.CONFIG_CONST_PORT, () => {
    return console.log(
      `${
        CONFIG_CONST.CONFIG_CONST_LISTEN_MESSAGE +
        CONFIG_CONST.CONFIG_CONST_PORT
      }`.blue
    )
  })
}
export default config