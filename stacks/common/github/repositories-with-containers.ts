import { GitHubAccess } from '@tabetalt/infra-components';
import { identityPool, identityPoolProvider } from '../google/identity-pool';
import {
  provider as googleProvider,
  legacyProvider as legacyGoogleProvider,
} from '../google/provider';
import { provider as githubProvider } from './provider';

const repositoryWithContainer = ['api-v2', 'backoffice-v2'];

new GitHubAccess(
  'container',
  {
    identityPoolName: identityPool.name,
    identityPoolProviderName: identityPoolProvider.name,
    repositories: repositoryWithContainer,
  },
  { providers: [googleProvider, githubProvider, legacyGoogleProvider] },
);
