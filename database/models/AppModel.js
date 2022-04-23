import mongoose from 'mongoose';
import {AppSchema} from '../schemas/AppSchema.js'
const appModel = mongoose.model('appModel', AppSchema);

export default appModel;