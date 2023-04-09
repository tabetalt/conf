import { GitHubAccess } from '@tabetalt/infra-components';
import { provider as githubProvider } from '../github/provider';
import { identityPool, identityPoolProvider } from './google/identity-pool';
import {
  provider as googleProvider,
  legacyProvider as legacyGoogleProvider,
} from './google/provider';

new GitHubAccess(
  'tabetalt-main-conf',
  {
    identityPoolName: identityPool.name,
    identityPoolProviderName: identityPoolProvider.name,
    repositories: ['conf'],
  },
  { providers: [googleProvider, githubProvider, legacyGoogleProvider] },
);

// This access is given access manually.
