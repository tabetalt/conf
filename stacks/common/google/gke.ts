import * as google from '@pulumi/google-native';
import { region } from './config';
import { provider } from './provider';

export const cluster = new google.container.v1.Cluster(
  'core-cluster',
  {
    name: 'tabetalt-main',
    releaseChannel: { channel: 'REGULAR' },
    location: region,
    autopilot: { enabled: true },
  },
  { provider, protect: true },
);
