import mongoose from 'mongoose';
import {UserSchema} from '../schemas/UserSchema.js'
const userModel = mongoose.model('userModel', UserSchema);

export default userModel;