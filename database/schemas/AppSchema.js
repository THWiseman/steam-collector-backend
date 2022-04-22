import mongoose from 'mongoose';
const { Schema } = mongoose;

export const AppSchema = new Schema ({
    AppId : {type: Number, required: true},
    AppCollections : {type: [Number]},
    OwnedBy : {type: [Number]},
    RecommendedBy : {type: [Number]}
    }, {collection : 'apps'}
)