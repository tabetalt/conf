import * as github from '@pulumi/github';
import { token } from './config';
import { provider } from './provider';

new github.ActionsOrganizationSecret(
  'bot-secret',
  {
    secretName: 'PAYTRON_GITHUB_TOKEN',
    plaintextValue: token,
    visibility: 'all',
  },
  { provider },
);
