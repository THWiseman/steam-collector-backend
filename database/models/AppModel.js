import mongoose from 'mongoose';
import {AppSchema} from '../schemas/AppSchema.js'
const appModel = mongoose.model('userModel', AppSchema);

export default appModel;