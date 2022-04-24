import mongoose from 'mongoose';
const { Schema } = mongoose;

export const PersonalInfoSchema = new Schema ( {
        Name: String,
        Age: Number,
        Address: String,
        Email: String,
        Password: String
    }
)