import * as google from '@pulumi/google-native';
import { region } from './config';
import { provider } from './provider';

export const ipAddress = new google.compute.v1.Address(
  'ingress-address',
  {
    name: 'ingress-address',
    addressType: 'EXTERNAL',
    region,
  },
  { provider },
);
