import * as google from '@pulumi/google-native';
import { projectId, region, zone } from './config';

export const provider = new google.Provider('main', {
  project: projectId,
  region,
  zone,
});
