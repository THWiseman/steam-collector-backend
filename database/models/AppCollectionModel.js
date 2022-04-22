import mongoose from 'mongoose';
import {AppCollectionSchema} from '../schemas/AppCollectionSchema.js'
const appCollectionModel = mongoose.model('userModel', AppCollectionSchema);

export default appCollectionModel;