import { Model, Types } from 'mongoose';

export interface TProfile {
  platform: string;
  url: string;
  iconUrl?: string;
}

export interface TTrustedByLogo {
  name: string;
  logoUrl: string;
}

export interface TSiteSettings {
  _id?: Types.ObjectId;
  siteName: string;
  tagline: string;
  logo: string;
  logoDark?: string;
  heroVideoUrl?: string;
  contactEmail: string;
  notificationEmail?: string;
  contactPhone: string;
  officeAddress: string;
  googleMapsEmbed?: string;
  profiles: TProfile[];
  statsProjects: number;
  statsCountries: number;
  statsYears: number;
  statsInternational: number;
  trustedByLogos: TTrustedByLogo[];
  updatedAt?: Date;
}

export interface ISiteSettingsModel extends Model<TSiteSettings> {}
