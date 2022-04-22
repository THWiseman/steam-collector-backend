import mongoose from 'mongoose';
const { Schema } = mongoose;

export const PersonalInfoSchema = new Schema ( {
    Name: String,
    Age: Number,
    Address: String
    }
)

export const UserSchema = new Schema ({
    UserName : {type: String, required: true},
    SteamId : {type: Number},
    UserType: {type: String, default: "Follower"},
    FollowedCurators : {type: [Number]},
    Followers : {type: [Number]},
    CreatedCollections : {type: [Number]},
    SavedCollections : {type: [Number]},
    PersonalInfo : PersonalInfoSchema,
    RecommendedApps : {type: [Number]},
    OwnedApps : {type: [Number]},
    }, {collection : 'users'}
)