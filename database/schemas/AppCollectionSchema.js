import mongoose from 'mongoose';
const { Schema } = mongoose;

export const AppCollectionSchema = new Schema ({
    Title: String,
    Creator: String,
    CreatorName: String,
    Apps: [Number],
    Followers: [String],
    AnonymousRecommendations: Number
}, {collection : 'appCollections'})