import { Model, Types } from 'mongoose';

export interface TTeamMember {
  _id?: Types.ObjectId;
  name: string;
  role: string;
  photo: string;
  bio?: string;            // Markdown
  linkedIn?: string;
  email?: string;
  order: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITeamMemberModel extends Model<TTeamMember> {}
