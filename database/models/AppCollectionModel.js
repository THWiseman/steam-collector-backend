import mongoose from 'mongoose';
import {AppCollectionSchema} from '../schemas/AppCollectionSchema.js'
const appCollectionModel = mongoose.model('appCollectionModel', AppCollectionSchema);

export default appCollectionModel;