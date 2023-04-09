import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';

export interface DatabaseComponentArgs {
  /**
   * @default ward
   */
  team?: string;

  /**
   * Defaults to name
   */
  username?: string;

  /**
   * Defaults to name
   */
  database?: string;

  /**
   * @default <team>.zalan.do
   */
  crd?: string;
}

export class DatabaseComponent extends pulumi.ComponentResource {
  public readonly cluster: k8s.apiextensions.CustomResource;

  public readonly dbSecretName: pulumi.Output<string>;
  public readonly serviceHostname: pulumi.Output<string>;
  public readonly connectionString: pulumi.Output<string>;

  constructor(
    name: string,
    args?: DatabaseComponentArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('tabetalt:database', name, args, opts);

    const crd = 'acid.zalan.do';

    const {
      username = name,
      database = name,
      team = 'ward',
    } = args || {};

    this.cluster = new k8s.apiextensions.CustomResource(
      name,
      {
        kind: 'postgresql',
        apiVersion: `${crd}/v1`,
        metadata: {
          name: `${team}-${name}`,
          labels: {
            team,
          },
        },
        spec: {
          teamId: team,
          postgresql: {
            version: '14',
          },
          numberOfInstances: 1,
          volume: {
            size: '10Gi',
          },
          users: {
            [username]: [],
          },
          databases: {
            [database]: database,
          },
          // enableConnectionPooler: true,
          allowedSourceRanges: null,
          resources: {
            requests: {
              cpu: '50m',
              memory: '100Mi',
            },
            limits: {
              cpu: '100m',
              memory: '150Mi',
            },
          },
        },
      },
      { parent: this },
    );

    // Template: {namespace}.{username}.{cluster}.credentials.{tprkind}.{tprgroup}
    this.dbSecretName = pulumi.interpolate`${username}.${this.cluster.metadata.name}.credentials.postgresql.${crd}`;

    this.serviceHostname = pulumi.interpolate`${this.cluster.metadata.name}.${this.cluster.metadata.namespace}.svc.cluster.local`;

    this.connectionString = pulumi.interpolate`postgres://$(POSTGRES_username):$(POSTGRES_password)@${this.serviceHostname}:5432/${database}?sslmode=require`;
  }

  dbEnvFromSecret(): pulumi.Input<k8s.types.input.core.v1.EnvFromSource> {
    return {
      prefix: 'POSTGRES_',
      secretRef: {
        name: this.dbSecretName,
      },
    };
  }
}
