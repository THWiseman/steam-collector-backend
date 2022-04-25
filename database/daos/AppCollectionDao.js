import appCollectionModel from '../models/AppCollectionModel.js';
export const findAllAppCollections = async () => {
    return appCollectionModel.find();
}

export const findCollectionsMadeByUser = async(userId) => {
    return  appCollectionModel.find({Creator: userId});
}

export const findCollectionById = async(collectionId) => {
    return appCollectionModel.findById(collectionId);
}

export const boostCollection = async(collectionId) => {
    let collection = await appCollectionModel.findById(collectionId);
    collection["AnonymousRecommendations"] = collection["AnonymousRecommendations"] + 1;
    collection = await collection.save();
    return collection;
}

export const saveCollection = async(userId,collectionId) => {
    let collection = await appCollectionModel.findById(collectionId);
    collection["Followers"].push(userId);
    collection = await collection.save();
    return collection;
}

export const createCollection = (collection) => appCollectionModel.create(collection);
export const deleteCollection = (collectionId) => appCollectionModel.deleteOne({_id: collectionId});
export const updateCollection = (collectionId, collection) => appCollectionModel.updateOne({_id: collectionId}, {$set: collection})