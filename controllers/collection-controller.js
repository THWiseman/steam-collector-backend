import * as collectionDao from "../database/daos/AppCollectionDao.js";
import * as userDao from "../database/daos/UserDao.js"
import * as steamService from './steam-controller.js'

const collectionController = (app) => {
    app.get('/api/steamcollector/collections', (req,res) => {
        getAllCollections(req,res);
    });

    app.get('/api/steamcollector/collections/:userId', (req,res) => {
        getCollectionsMadeByUser(req,res);
    })

    app.get('/api/steamcollector/collection/cid/:collectionId', (req,res) => {
        getCollectionById(req,res);
    })

    app.get('/api/steamcollector/collectionName/:collectionId', (req,res) => {
        getCollectionTitle(req,res);
    })

    app.post('/api/steamcollector/collection/', (req,res) => {
        boostCollection(req,res);
    })

    app.put('/api/steamcollector/collection/', (req,res) => {
        saveCollection(req,res);
    })

    app.post('/api/steamcollector/collection/create', (req,res) => {
        createCollection(req,res);
    })
}

const getAllCollections = async(req,res) => {
    const collectionsArray = await collectionDao.findAllAppCollections();
    res.send(collectionsArray);
}

const getCollectionsMadeByUser = async(req,res) => {
    const userId = req.params.userId;
    const collectionsArray = await collectionDao.findCollectionsMadeByUser(userId);
    res.send(collectionsArray);
}

const getCollectionById = async(req,res) => {
    const collectionId = req.params.collectionId;
    const collection = await collectionDao.findCollectionById(collectionId);
    res.send(collection);
}

const boostCollection = async(req,res) => {
    const collectionId = req.body.collectionId;
    try{
        const collection = await collectionDao.boostCollection(collectionId);
        res.send(collection);
    } catch (e) {
        console.log("Error boosting collection");
    }
}

const saveCollection = async(req,res) => {
    const collectionId = req.body.collectionId;
    const userId = req.body.userId;
    try{
        const collection = await collectionDao.saveCollection(userId, collectionId);
    } catch (e) {
        console.log("Error updating collection with new saved user");
    }

    try {
        const user = await userDao.saveCollection(userId, collectionId);
        res.send(user);
    } catch (e) {
        console.log("Error saving collection to user.");
    }
}

const createCollection = async(req,res) => {
    const collection = req.body;
    const userId = collection.Creator;
    try{
        const newCollection = await (collectionDao.createCollection(collection));
        const user = await userDao.createCollection(userId, newCollection._id.toString());
        res.send(newCollection);
    } catch (e) {
        console.log("Error creating new collection");
    }
}

const getCollectionTitle = async(req,res) => {
    const collectionId = req.params.collectionId;
    try{
        const collection =  await collectionDao.findCollectionById(collectionId);
        res.send(collection.Title);
    } catch (e){
        console.log("Error retrieving collection title");
    }
}
export default collectionController;