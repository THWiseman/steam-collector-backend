import userModel from '../models/UserModel.js';
export const findAllUsers = () => userModel.find();
export const findUserBySteamId = (id) => userModel.findOne({SteamId : id})
export const createUser = (user) => userModel.create(user);
export const deleteUser = (user) => userModel.deleteOne({_id: userId});
export const updateUser = (userId, user) => userModel.updateOne({_id: userId}, {$set: user});