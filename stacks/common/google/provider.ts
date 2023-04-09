import * as gcp from '@pulumi/gcp';
import * as google from '@pulumi/google-native';
import { region, zone } from './config';
import { apiServices, project } from './project';

export const provider = new google.Provider(
  'main',
  {
    project: project.name,
    region,
    zone,
  },
  { dependsOn: [project, apiServices] },
);

export const legacyProvider = new gcp.Provider(
  'legacy',
  {
    project: project.name,
    region,
    zone,
  },
  { dependsOn: [project, apiServices] },
);
