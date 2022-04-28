import userModel from '../models/UserModel.js';
import mongoose from "mongoose";
import appModel from "../models/AppModel.js";

export const findAllUsers = async () => {
    return userModel.find();
}

export const findUserById = async (id) => {
    return userModel.findById(id.toString());
}

export const findUserByCredentials = async (email, password) => {
    return userModel.findOne({$and: [{"PersonalInfo.Email" : email}, {"PersonalInfo.Password" : password}]});
}

export const findUserBySteamId = async (id) =>{
   return userModel.findOne({SteamId : id});
}

export const findUserByEmail =  async (email) => {
    return userModel.findOne({"PersonalInfo.Email" : email});
}

export const createUser = async (user) => {
    return userModel.create(user);
}

export const deleteUser = (userId) => userModel.deleteOne({_id: userId});

export const updateOwnedApps = async (id, user) => {
    const doc = await userModel.findById(id);
    doc.OwnedApps = user.OwnedApps;
    await doc.save();
    return doc;
}

export const getAllCurators = async () => {
    const curators = await userModel.find({UserType : "Curator"});
    console.log(curators);
    return curators;
}

export const recommendApp = async(userId, appId) => {
    let user = await userModel.findById(userId);
    user["RecommendedApps"].push(appId);
    user = await user.save();
    return user;
}

export const saveCollection = async(userId, collectionId) => {
    let user = await userModel.findById(userId);
    user["SavedCollections"].push(collectionId);
    user = await user.save();
    return user;
}

export const createCollection = async(userId, collectionId) => {
    let user = await userModel.findById(userId);
    user["CreatedCollections"].push(collectionId);
    user = await user.save();
    return user;
}

export const updateUserPersonalInfo = async(user) => {
    let dbuser = await userModel.findById(user._id);
    dbuser.UserType = user.UserType;
    dbuser.PersonalInfo = user.PersonalInfo;
    dbuser = await dbuser.save();
    return dbuser;
}

export const followCurator = async (followerId, curatorId) => {
    let follower = {};
    try{
        follower = await userModel.findById(followerId.toString());
        follower.FollowedCurators.push(curatorId);
        follower = follower.save();
    } catch (e) {
        console.log("Failed to find follower by ID");
    }

    try {
        const followedCurator = await userModel.findById(curatorId.toString());
        followedCurator.Followers.push(followerId);
        followedCurator.save();
    } catch (e) {
        console.log("Failed to find followed curator by ID");
    }

    return follower;
}

export const findUsersThatOwnApp = async(appId) => {
    const users = await userModel.find({OwnedApps:parseInt(appId)},{_id: 1});
    const strings = [];
    users.map(u => strings.push(u._id.toString()));
    return strings;
}

export const findUsersThatRecommendApp = async(appId) => {
    const users = await userModel.find({RecommendedApps:parseInt(appId)},{_id: 1});
    const strings = [];
    users.map(u => strings.push(u._id.toString()));
    return strings;
}
