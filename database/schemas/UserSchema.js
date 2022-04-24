import mongoose from 'mongoose';
const { Schema } = mongoose;
import {PersonalInfoSchema} from "./PersonalInfoSchema.js";

export const UserSchema = new Schema ({
        UserName : {type: String, required: true},
        SteamId : {type: String},
        UserType: {type: String, default: "User"},
        FollowedCurators : {type: [Number]},
        Followers : {type: [Number]},
        CreatedCollections : {type: [Number]},
        SavedCollections : {type: [Number]},
        PersonalInfo : PersonalInfoSchema,
        RecommendedApps : {type: [Number]},
        OwnedApps : {type: [Number]},
    }, {collection : 'users'}
)