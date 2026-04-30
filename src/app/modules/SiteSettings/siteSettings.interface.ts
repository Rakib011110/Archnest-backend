import { Model, Types } from 'mongoose';

export interface TSocialLinks {
  linkedIn?: string;
  facebook?: string;
  instagram?: string;
  behance?: string;
  youtube?: string;
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
  contactPhone: string;
  officeAddress: string;
  googleMapsEmbed?: string;
  socialLinks: TSocialLinks;
  statsProjects: number;
  statsCountries: number;
  statsYears: number;
  statsInternational: number;
  trustedByLogos: TTrustedByLogo[];
  updatedAt?: Date;
}

export interface ISiteSettingsModel extends Model<TSiteSettings> {}
