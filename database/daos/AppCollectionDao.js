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
    try{
        collection["AnonymousRecommendations"] = collection["AnonymousRecommendations"] + 1;
        collection = await collection.save();
    } catch (e) {
        console.log("Error boosting collection");
    }
    return collection;
}

export const saveCollection = async(userId,collectionId) => {
    let collection = await appCollectionModel.findById(collectionId);
    collection["Followers"].push(userId);
    collection = await collection.save();
    return collection;
}

export const addAppToCollection = async (appId,collectionId) => {
    let collection = await appCollectionModel.findById(collectionId);
    collection["Apps"].push(parseInt(appId));
    collection = await collection.save();
    return collection;
}

export const findCollectionsThatContainApp = async(appId) => {
    const collections = await appCollectionModel.find({apps:parseInt(appId)}).select("_id");
    const strings = [];
    collections.map(c => strings.push(c._id.toString()));
    return strings;
}

export const createCollection = (collection) => appCollectionModel.create(collection);
export const deleteCollection = (collectionId) => appCollectionModel.deleteOne({_id: collectionId});
export const updateCollection = (collectionId, collection) => appCollectionModel.updateOne({_id: collectionId}, {$set: collection})