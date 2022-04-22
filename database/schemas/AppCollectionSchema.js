import mongoose from 'mongoose';
const { Schema } = mongoose;

export const AppCollectionSchema = new Schema ({
    Title: String,
    Apps: [Number]
}, {collection : 'appCollections'})