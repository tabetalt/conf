import { DomainRecords } from '@tabetalt/infra-components';
import { provider } from '../provider';
import { zone } from './zone';

new DomainRecords(
  'legacy',
  [
    { type: 'A', name: '*.tabetalt.no.', data: ['52.157.217.16'] },
    { type: 'A', name: 'admin.tabetalt.no.', data: ['52.236.151.201'] },
    {
      type: 'TXT',
      name: 'mailo._domainkey.tabetalt.no.',
      data: [
        '"k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDv1dEvaOnPSv9PUmoes4R0U9hjlaHRFGLS09yDpgR5a4vkckXV13Dt8aqayqPsdAuYZ6EW6UqyO6xh9obNSzPnnOoW1Z76v7UtICPf74PUDK3RAKHLGBVaXybIIlc+8tozKEoRD1IfyeQav2834WxBfVL81WEWgcSjtVqHR7i6nQIDAQAB"',
      ],
    },
    {
      type: 'TXT',
      name: 'mandrill._domainkey.tabetalt.no.',
      data: [
        '"v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCrLHiExVd55zd/IQ/J/mRwSRMAocV/hMB3jXwaHH36d9NaVynQFYV8NaWi69c1veUtRzGt7yAioXqLj7Z4TeEUoOLgrKsn8YnckGs9i3B3tVFB+Ch/4mPhXWiNfNdynHWBcPcbJ8kjEQ2U8y78dHZj1YeRXXVvWob2OaKynO8/lQIDAQAB;"',
      ],
    },
    {
      type: 'TXT',
      name: 'smtp._domainkey.tabetalt.no.',
      data: [
        '"k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDv1dEvaOnPSv9PUmoes4R0U9hjlaHRFGLS09yDpgR5a4vkckXV13Dt8aqayqPsdAuYZ6EW6UqyO6xh9obNSzPnnOoW1Z76v7UtICPf74PUDK3RAKHLGBVaXybIIlc+8tozKEoRD1IfyeQav2834WxBfVL81WEWgcSjtVqHR7i6nQIDAQAB"',
      ],
    },
    {
      type: 'CNAME',
      name: 'em7151.tabetalt.no.',
      data: ['u22962284.wl035.sendgrid.net.'],
    },
    {
      type: 'CNAME',
      name: 's1._domainkey.tabetalt.no.',
      data: ['s1.domainkey.u22962284.wl035.sendgrid.net.'],
    },
    {
      type: 'CNAME',
      name: 's2._domainkey.tabetalt.no.',
      data: ['s2.domainkey.u22962284.wl035.sendgrid.net.'],
    },
    { type: 'CNAME', name: 'url1906.tabetalt.no.', data: ['sendgrid.net.'] },
    { type: 'CNAME', name: '22962284.tabetalt.no.', data: ['sendgrid.net.'] },
  ],
  zone.name,
  { provider },
);
