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
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const body = req.body;

  // ── Branding files ─────────────────────────────────────────────────────────
  if (files?.logo?.[0]) body.logo = `/uploads/site/${files.logo[0].filename}`;
  if (files?.logoDark?.[0]) body.logoDark = `/uploads/site/${files.logoDark[0].filename}`;

  // ── Parse profiles array (sent as JSON string OR individual fields) ─────────
  if (typeof body.profiles === 'string') {
    try {
      body.profiles = JSON.parse(body.profiles);
    } catch {
      body.profiles = [];
    }
  }
  // Attach uploaded profile icons to each profile entry
  if (Array.isArray(body.profiles)) {
    body.profiles = body.profiles.map((profile: Record<string, string>, idx: number) => {
      const iconFile = files?.[`profileIcon_${idx}`]?.[0];
      return {
        ...profile,
        ...(iconFile ? { iconUrl: `/uploads/site/${iconFile.filename}` } : {}),
      };
    });
  }

  // ── Parse trustedByLogos array ─────────────────────────────────────────────
  if (typeof body.trustedByLogos === 'string') {
    try {
      body.trustedByLogos = JSON.parse(body.trustedByLogos);
    } catch {
      body.trustedByLogos = [];
    }
  }
  // Attach uploaded partner logos to each trustedByLogos entry
  if (Array.isArray(body.trustedByLogos)) {
    body.trustedByLogos = body.trustedByLogos.map((logo: Record<string, string>, idx: number) => {
      const logoFile = files?.[`partnerLogo_${idx}`]?.[0];
      return {
        ...logo,
        ...(logoFile ? { logoUrl: `/uploads/site/${logoFile.filename}` } : {}),
      };
    });
  }

  // ── Numeric stats coercion ─────────────────────────────────────────────────
  const numericFields = ['statsProjects', 'statsCountries', 'statsYears', 'statsInternational'];
  numericFields.forEach((f) => { if (body[f] !== undefined) body[f] = Number(body[f]); });

  const result = await SiteSettingsServices.updateSettings(body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Site settings updated', data: result });
});

export const SiteSettingsController = { getSettings, updateSettings };

