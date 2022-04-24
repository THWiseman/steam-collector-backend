import userModel from '../models/UserModel.js';

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

export const updateUser = (userId, user) => userModel.updateOne({_id: userId}, {$set: user});