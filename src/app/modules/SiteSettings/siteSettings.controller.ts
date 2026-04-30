import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SiteSettingsServices } from './siteSettings.services';

const getSettings = catchAsync(async (_req: Request, res: Response) => {
  const result = await SiteSettingsServices.getSettings();
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Site settings retrieved', data: result });
});

const updateSettings = catchAsync(async (req: Request, res: Response) => {
  if (req.file) req.body.logo = `/uploads/site/${req.file.filename}`;
  const result = await SiteSettingsServices.updateSettings(req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Site settings updated', data: result });
});

export const SiteSettingsController = { getSettings, updateSettings };
