import appModel from '../models/AppModel.js';
export const findAllApps = () => appModel.find();
export const findAppByAppId = (appId) => appModel.findOne({AppId : appId});
export const createApp = (app) => {
    appModel.create(app);
    return app;
}
export const recommendApp = async (userId, appId) => {
    let app = await appModel.findOne({AppId : appId});
    app["RecommendedBy"].push(userId);
    app = await app.save();
    return app;
}
export const deleteApp = (appId) => appModel.deleteOne({_id: appId});
export const updateApp = (appId, app) => appModel.updateOne({_id: appId}, {$set: app});