import appModel from '../models/AppModel.js';
export const findAllApps = () => appModel.find();
export const createApp = (app) => appModel.create(app);
export const deleteApp = (appId) => appModel.deleteOne({_id: appId});
export const updateApp = (appId, app) => appModel.updateOne({_id: appId}, {$set: app});