import mongoose from 'mongoose';
const { Schema } = mongoose;

export const AppCollectionSchema = new Schema ({
    Title: String,
    Creator: Number,
    CreatorName: String,
    Apps: [Number],
    Followers: [Number],
    AnonymousRecommendations: Number
}, {collection : 'appCollections'})