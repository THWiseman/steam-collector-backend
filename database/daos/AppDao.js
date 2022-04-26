import appModel from '../models/AppModel.js';
export const findAllApps = () => appModel.find();
export const findAppByAppId = (appId) => appModel.findOne({AppId : parseInt(appId)});
export const createApp = (app) => {
    appModel.create(app);
    return app;
}
export const recommendApp = async (userId, appId) => {
    let app = await appModel.findOne({AppId : parseInt(appId)});
    try{
        app["RecommendedBy"].push(userId);
        app = await app.save();
    } catch (e) {
        console.log("Error updating recommended by in database.");
    }
    return app;
}

export const insertAllApps = async (appArray) => {
    const newArray = [];
    for(let i =0; i < appArray.length; i++) {
        const newApp = {
            "AppId" : appArray[i].appid,
            "AppCollections" : [],
            "OwnedBy" : [],
            "RecommendedBy" : [],
            "AnonymousRecommendations": 0,
            "AppTitle" : appArray[i].name,
            "Price" : ""
        }
        newArray.push(newApp);
    }

    const inserted = await appModel.insertMany(newArray);
    console.log(inserted);
    return inserted;
}

export const deleteApp = (appId) => appModel.deleteOne({_id: appId});
export const updateApp = async (app) => {
    let dbapp = await appModel.findById(app._id);
    if(dbapp){
        if(app.AppId !== 0 && app.AppId !== ""){
            dbapp["AppId"] = app.AppId;
        }
        if(app.AppCollections.length !== 0) {
            dbapp["AppCollections"] = app.AppCollections;
        }
        if(app.OwnedBy.length !== 0){
            dbapp["OwnedBy"] = app.OwnedBy;
        }
        if(app.RecommendedBy.length !== 0){
            dbapp["RecommendedBy"] = app.RecommendedBy;
        }

        if(app.AnonymousRecommendations !== 0){
            dbapp["AnonymousRecommendations"] = app.AnonymousRecommendations;
        }

        if(app.AppTitle !== "") {
            dbapp["AppTitle"] = app.AppTitle;
        }
        if(app.Price !== ""){
            dbapp["Price"] = app.Price;
        }
        dbapp = await dbapp.save();
    }
    return dbapp;
}