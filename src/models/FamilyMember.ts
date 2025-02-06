import mongoose, { Schema, Document } from 'mongoose';

export interface IFamilyMember extends Document {
  firstName: string;
  lastName: string;
  birthDate?: string;
  deathDate?: string;
  gender: 'male' | 'female' | 'other';
  type: 'blood' | 'adopted' | 'step' | 'foster' | 'spouse' | 'other';
  profilePicture?: string;
  bio?: string;
  livingIn?: string;
  position: {
    x: number;
    y: number;
  };
  connections: string[];
}

const FamilyMemberSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: String },
  deathDate: { type: String },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  type: { type: String, enum: ['blood', 'adopted', 'step', 'foster', 'spouse', 'other'], required: true },
  profilePicture: { type: String },
  bio: { type: String },
  livingIn: { type: String },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  connections: [{ type: Schema.Types.ObjectId, ref: 'FamilyMember' }]
});

export default mongoose.model<IFamilyMember>('FamilyMember', FamilyMemberSchema);