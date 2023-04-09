import * as google from '@pulumi/google-native';
import { interpolate } from '@pulumi/pulumi';
import { rootDomain } from '../../config';
import { provider } from '../provider';

export const zone = new google.dns.v1.ManagedZone(
  'main-zone',
  {
    description: 'Main zone for tabetalt.no',
    dnsName: interpolate`${rootDomain}.`,
    dnssecConfig: {
      state: 'on',
    },
    name: 'main-zone',
    visibility: 'public',
  },
  { provider },
);
