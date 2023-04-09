import { GitHubAccess } from '@tabetalt/infra-components';
import * as github from '@pulumi/github';
import * as gcp from '@pulumi/gcp';
import { provider as githubProvider } from './github/provider';
import {
  artifactRepoUrl,
  repository as artifactRepository,
} from './google/artifact-registry';
import { identityPool, identityPoolProvider } from './google/identity-pool';
import {
  provider as googleProvider,
  legacyProvider as legacyGoogleProvider,
} from './google/provider';
import { interpolate } from '@pulumi/pulumi';

const repositoryWithContainer = ['api-v2', 'backoffice-v2'];

const githubAccess = new GitHubAccess(
  'container',
  {
    identityPoolName: identityPool.name,
    identityPoolProviderName: identityPoolProvider.name,
    repositories: repositoryWithContainer,
  },
  { providers: [googleProvider, githubProvider, legacyGoogleProvider] },
);

repositoryWithContainer.map(repository => [
  new github.ActionsSecret(
    `${repository}-container-registry`,
    {
      repository,
      secretName: 'CONTAINER_REGISTRY',
      plaintextValue: artifactRepoUrl,
    },
    { provider: githubProvider },
  ),
  // TODO: Replace this with native provider once IamMembers are fixed in google-native
  // @see https://github.com/pulumi/pulumi-google-native/issues/836
  new gcp.artifactregistry.RepositoryIamMember(
    `${repository}-container-registry`,
    {
      repository: artifactRepository.name,
      member: interpolate`serviceAccount:${githubAccess.serviceAccount.email}`,
      role: 'roles/artifactregistry.writer',
    },
    { provider: legacyGoogleProvider },
  ),
]);
