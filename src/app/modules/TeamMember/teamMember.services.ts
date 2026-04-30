import httpStatus from 'http-status';
import { TTeamMember } from './teamMember.interface';
import { TeamMember } from './teamMember.model';
import AppError from '../../error/AppError';

const create = async (payload: Partial<TTeamMember>): Promise<TTeamMember> => TeamMember.create(payload);

const getAll = async (query: any) => {
  const { isActive, page = 1, limit = 20, sortBy = 'order', sortOrder = 'asc' } = query;
  const filter: Record<string, any> = {};
  if (isActive !== undefined) filter.isActive = isActive;
  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    TeamMember.find(filter).sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 }).skip(skip).limit(Number(limit)),
    TeamMember.countDocuments(filter),
  ]);
  return { data, meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } };
};

const getById = async (id: string): Promise<TTeamMember> => {
  const r = await TeamMember.findById(id);
  if (!r) throw new AppError(httpStatus.NOT_FOUND, 'Team member not found');
  return r;
};

const update = async (id: string, payload: Partial<TTeamMember>): Promise<TTeamMember> => {
  const r = await TeamMember.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!r) throw new AppError(httpStatus.NOT_FOUND, 'Team member not found');
  return r;
};

const remove = async (id: string): Promise<TTeamMember> => {
  const r = await TeamMember.findByIdAndDelete(id);
  if (!r) throw new AppError(httpStatus.NOT_FOUND, 'Team member not found');
  return r;
};

export const TeamMemberServices = { create, getAll, getById, update, remove };
