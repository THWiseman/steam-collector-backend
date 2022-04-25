import userModel from '../models/UserModel.js';
import mongoose from "mongoose";
import appModel from "../models/AppModel.js";

export const findAllUsers = async () => {
    return userModel.find();
}

export const findUserById = async (id) => {
    console.log(id);
    return userModel.findById(id);
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
    console.log(userId);
    console.log(user);
    user["RecommendedApps"].push(appId);
    user = await user.save();
    console.log(user);
    return user;
}
