import mongoose from 'mongoose';
const { Schema } = mongoose;
import {PersonalInfoSchema} from "./PersonalInfoSchema.js";

export const UserSchema = new Schema ({
        UserName : {type: String, required: true},
        SteamId : {type: String},
        UserType: {type: String, default: "User"},
        FollowedCurators : {type: [String]},
        Followers : {type: [String]},
        CreatedCollections : {type: [String]},
        SavedCollections : {type: [String]},
        PersonalInfo : PersonalInfoSchema,
        RecommendedApps : {type: [String]},
        OwnedApps : {type: [String]},
    }, {collection : 'users'}
)