import * as google from '@pulumi/google-native';
import { interpolate } from '@pulumi/pulumi';
import { projectId, region } from './config';
import { provider } from './provider';

export const repository = new google.artifactregistry.v1.Repository(
  'main-artifact-registry',
  {
    repositoryId: projectId,
    location: region,
    format: 'DOCKER',
    description: 'Main artifact registry, used for most services.',
  },
  { provider },
);

export const artifactRepoUrl = interpolate`${repository.location}-docker.pkg.dev/${projectId}/${repository.repositoryId}`;
