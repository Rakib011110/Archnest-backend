import { TSiteSettings } from './siteSettings.interface';
import { SiteSettings } from './siteSettings.model';

const getSettings = async (): Promise<TSiteSettings> => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({ siteName: 'Archnest Studio' });
  }
  return settings;
};

const updateSettings = async (payload: Partial<TSiteSettings>): Promise<TSiteSettings> => {
  const result = await SiteSettings.findOneAndUpdate(
    {},
    { $set: payload },
    { new: true, upsert: true, runValidators: true }
  );
  return result;
};

export const SiteSettingsServices = { getSettings, updateSettings };
