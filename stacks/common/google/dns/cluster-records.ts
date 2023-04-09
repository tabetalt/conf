import { DomainRecords } from '@tabetalt/infra-components';
import { ipAddress } from '../ip-address';
import { provider } from '../provider';
import { zone } from './zone';

new DomainRecords(
  'cluster',
  [{ type: 'A', name: 'ingress.tabetalt.no.', data: [ipAddress.address] }],
  zone.name,
  { provider },
);
