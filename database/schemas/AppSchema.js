import mongoose from 'mongoose';
const { Schema } = mongoose;

export const AppSchema = new Schema ({
    AppId : {type: Number},
    AppCollections : {type: [String]},
    OwnedBy : {type: [String]},
    RecommendedBy : {type: [String]},
    AnonymousRecommendations: {type: Number},
    AppTitle : {type: String},
    Price : {type : String}
    }, {collection : 'apps'}
)