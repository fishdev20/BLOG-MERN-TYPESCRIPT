import mongoose, { Schema } from "mongoose";
import IUser from "../interfaces/user";


const USerSchema: Schema = new Schema({
    uid: {
        type: String,
        unique: true
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    picture: {
        type: String
    }
})

export default mongoose.model<IUser>('User', USerSchema)