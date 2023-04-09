import * as google from '@pulumi/google-native';
import * as gcp from '@pulumi/gcp';
import * as github from '@pulumi/github';
import * as pulumi from '@pulumi/pulumi';
import { interpolate } from '@pulumi/pulumi';

export interface GitHubAccessArgs {
  /**
   * The name of the identity pool provider.
   *
   * Example: identityPoolProvider.name
   */
  identityPoolProviderName: pulumi.Input<string>;

  /**
   * The name of the identity pool.
   *
   * Example: identityPool.name
   *
   * @see https://www.pulumi.com/docs/reference/pkg/gcp/iam/workloadidentitypool/
   */
  identityPoolName: pulumi.Input<string>;

  repositories: pulumi.Input<string>[];
}

/**
 * Creates a service account and access to it from GitHub Actions.
 */
export class GitHubAccess extends pulumi.ComponentResource {
  public readonly serviceAccount: google.iam.v1.ServiceAccount;

  constructor(
    name: string,
    args: GitHubAccessArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('flexisoft:github:access', name, args, opts);

    const { identityPoolName, identityPoolProviderName, repositories } = args;

    this.serviceAccount = new google.iam.v1.ServiceAccount(
      name,
      {
        accountId: interpolate`${name}-github`,
        displayName: `GitHub Actions Service Account (${name})`,
        description: 'Uses Workload Identity to bind to a GitHub repository',
      },
      { parent: this },
    );

    const knownRepositoryOwners = new Map<string, string>();

    const getOwner = async (repository: pulumi.Input<string>) => {
      return pulumi.output(repository).apply(async name => {
        if (knownRepositoryOwners.has(name)) {
          return knownRepositoryOwners.get(name);
        }

        const repo = await github.getRepository({ name }, { parent: this });

        const fullName = repo.fullName;
        if (!fullName) {
          throw new Error(`Could not find repository ${name}`);
        }

        const owner = fullName.split('/')[0];
        knownRepositoryOwners.set(name, owner);

        return owner;
      });
    };

    repositories.forEach(inputRepository =>
      pulumi
        .all([inputRepository, getOwner(inputRepository)])
        .apply(([repository, owner]) => {
          new github.ActionsSecret(
            `${name}-identity-provider-${owner}-${repository}`,
            {
              repository,
              secretName: 'GOOGLE_WORKLOAD_IDENTITY_PROVIDER',
              plaintextValue: identityPoolProviderName,
            },
            { parent: this, deleteBeforeReplace: true },
          );

          new github.ActionsSecret(
            `${name}-service-account-${owner}-${repository}`,
            {
              repository,
              secretName: 'GOOGLE_SERVICE_ACCOUNT',
              plaintextValue: this.serviceAccount.email,
            },
            { parent: this, deleteBeforeReplace: true },
          );

          // TODO: Replace this with native provider once IamMembers are fixed in google-native
          // @see https://github.com/pulumi/pulumi-google-native/issues/836
          new gcp.serviceaccount.IAMMember(
            `${name}-core-iam-service-${owner}-${repository}`,
            {
              serviceAccountId: this.serviceAccount.name,
              role: 'roles/iam.workloadIdentityUser',
              member: pulumi.interpolate`principalSet://iam.googleapis.com/${identityPoolName}/attribute.repository/${owner}/${repository}`,
            },
            { parent: this, deleteBeforeReplace: true },
          );

          // TODO: Replace this with native provider once IamMembers are fixed in google-native
          // @see https://github.com/pulumi/pulumi-google-native/issues/836
          new gcp.serviceaccount.IAMMember(
            `${name}-core-iam-service-token-${owner}-${repository}`,
            {
              serviceAccountId: this.serviceAccount.name,
              role: 'roles/iam.serviceAccountTokenCreator',
              member: pulumi.interpolate`principalSet://iam.googleapis.com/${identityPoolName}/attribute.repository/${owner}/${repository}`,
            },
            { parent: this, deleteBeforeReplace: true },
          );
        }),
    );
  }
}
