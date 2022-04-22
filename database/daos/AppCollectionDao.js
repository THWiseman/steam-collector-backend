import appCollectionModel from '../models/AppCollectionModel.js';
export const findAllAppCollections = () => appCollectionModel.find();
export const createCollection = (collection) => appCollectionModel.create(collection);
export const deleteCollection = (collectionId) => appCollectionModel.deleteOne({_id: collectionId});
export const updateCollection = (collectionId, collection) => appCollectionModel.updateOne({_id: collectionId}, {$set: collection})