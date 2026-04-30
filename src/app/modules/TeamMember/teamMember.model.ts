import { Schema, model } from 'mongoose';
import { ITeamMemberModel, TTeamMember } from './teamMember.interface';

const teamMemberSchema = new Schema<TTeamMember, ITeamMemberModel>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true },
    photo: { type: String, required: true },
    bio: { type: String },
    linkedIn: { type: String },
    email: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

teamMemberSchema.index({ isActive: 1, order: 1 });

export const TeamMember = model<TTeamMember, ITeamMemberModel>('TeamMember', teamMemberSchema);
