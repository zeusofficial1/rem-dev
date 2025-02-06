import mongoose, { Schema, Document } from 'mongoose';
import { FamilyMember } from './FamilyMember';

export interface IFamilyTree extends Document {
  name: string;
  description?: string;
  members: FamilyMember[];
}

const FamilyTreeSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  members: [{ type: Schema.Types.ObjectId, ref: 'FamilyMember' }]
});

export default mongoose.model<IFamilyTree>('FamilyTree', FamilyTreeSchema);