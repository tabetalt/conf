import { DomainRecords } from '@tabetalt/infra-components';
import { provider } from '../provider';
import { zone } from './zone';

new DomainRecords(
  'website',
  [
    { type: 'CNAME', name: 'www.tabetalt.no.', data: ['tabetalt.github.io.'] },
    {
      type: 'A',
      name: 'tabetalt.no.',
      data: [
        '185.199.108.153',
        '185.199.109.153',
        '185.199.110.153',
        '185.199.111.153',
      ],
    },
    {
      type: 'AAAA',
      name: 'tabetalt.no.',
      data: [
        '2606:50c0:8000::153',
        '2606:50c0:8001::153',
        '2606:50c0:8002::153',
        '2606:50c0:8003::153',
      ],
    },
    {
      type: 'CNAME',
      name: 'docs.tabetalt.no.',
      data: ['tabetalt.github.io.'],
    },
    {
      type: 'TXT',
      name: 'tabetalt.no.',
      data: [
        '"google-site-verification=9C3rrzRzEOFK5tuFR9Sw6OM5MheeM8juWkZliER5N1Y"',
        '"v=spf1 include:servers.mcsv.net include:mailgun.org include:spf.mandrillapp.com include:_spf.google.com ~all"',
        '"google-site-verification=_Wv5BY_vrmeHURKXNMtIacBtOeI_JBgTTJbXfZyQBm4"',
      ],
    },
    {
      type: 'MX',
      name: 'tabetalt.no.',
      data: [
        '1 aspmx.l.google.com.',
        '5 alt1.aspmx.l.google.com.',
        '5 alt2.aspmx.l.google.com.',
        '10 alt3.aspmx.l.google.com.',
        '10 alt4.aspmx.l.google.com.',
      ],
    },
  ],
  zone.name,
  { provider },
);
