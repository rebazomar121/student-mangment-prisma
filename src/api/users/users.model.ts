import { User } from "./users.types"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const Schema = new mongoose.Schema<User>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sessionToken: {
      type: String,
      required: false,
    },
    otp: {
      code: {
        type: String,
        required: false,
      },
      expireAt: {
        type: Date,
        required: false,
      },
    },
    phone: {
      number: {
        type: String,
        required: false,
        unique: true,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

Schema.methods.comparePassword = async function (password: string) {
  const result = await bcrypt.compare(password, this.password)
  return result
}

// not return this data's
Schema.methods.toJSON = function () {
  const Object = this
  const SchemaObject = Object.toObject()
  delete SchemaObject.password
  delete SchemaObject.token
  delete SchemaObject.secret
  delete SchemaObject.sessionToken
  return SchemaObject
}
const ImportedSchema = mongoose.model<User>("users", Schema)
export default ImportedSchema
