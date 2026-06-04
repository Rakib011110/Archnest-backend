import { Schema, model } from 'mongoose';
import { ISiteSettingsModel, TSiteSettings } from './siteSettings.interface';

const siteSettingsSchema = new Schema<TSiteSettings, ISiteSettingsModel>(
  {
    siteName: { type: String, default: 'Archnest Studio' },
    tagline: { type: String, default: '' },
    logo: { type: String, default: '' },
    logoDark: { type: String },
    heroVideoUrl: { type: String },
    contactEmail: { type: String, default: '' },
    notificationEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    officeAddress: { type: String, default: '' },
    googleMapsEmbed: { type: String },
    profiles: [{
      platform: { type: String, required: true },
      url: { type: String, required: true },
      iconUrl: { type: String },
    }],
    statsProjects: { type: Number, default: 0 },
    statsCountries: { type: Number, default: 0 },
    statsYears: { type: Number, default: 0 },
    statsInternational: { type: Number, default: 0 },
    trustedByLogos: [{
      name: { type: String },
      logoUrl: { type: String },
    }],
  },
  { timestamps: true }
);

export const SiteSettings = model<TSiteSettings, ISiteSettingsModel>('SiteSettings', siteSettingsSchema);
