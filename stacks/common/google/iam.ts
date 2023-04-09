import * as google from '@pulumi/google-native';
import { admins, developers } from '../config';
import { project } from './project';
import { provider } from './provider';

/**
 * The IAM members below grants developers to
 * the project. Developers can view the project,
 * and work with the cluster.
 */
developers.map(developer => [
  new google.cloudresourcemanager.v3.ProjectIamMember(
    `${developer}-viewer-role`,
    {
      member: developer,
      role: 'roles/viewer',
      name: `projects/${project.projectId}`,
    },
    { provider },
  ),
  new google.cloudresourcemanager.v3.ProjectIamMember(
    `${developer}-cluster-developer-role`,
    {
      member: developer,
      role: 'roles/container.developer',
      name: `projects/${project.projectId}`,
    },
    { provider },
  ),
]);

/**
 * The IAM members below grants admins to
 * the project. Admins has full access to
 * the project.
 *
 * The reasoning behind this is that if shit
 * hit the fan, we need someone that's able
 * to fix issues.
 */
admins.map(admin => [
  new google.cloudresourcemanager.v3.ProjectIamMember(
    `${admin}-owner-role`,
    {
      member: admin,
      role: 'roles/owner',
      name: `projects/${project.projectId}`,
    },
    { provider },
  ),
]);
