import * as gcp from '@pulumi/gcp';
import * as google from '@pulumi/google-native';
import { region, zone } from '../../google/config';

export const legacyProvider = new gcp.Provider('tabetalt-main-google', {
  project: 'tabetalt-main',
  region,
  zone,
});

export const provider = new google.Provider('tabetalt-main-google', {
  project: 'tabetalt-main',
  region,
  zone,
});
