import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';
import { interpolate } from '@pulumi/pulumi';

export interface AppComponentArgs {
  image: pulumi.Input<string>;

  /**
   * @default 8000
   */
  port?: pulumi.Input<number>;

  /**
   * List of environment variables to set in the container. Cannot be updated.
   */
  env?: pulumi.Input<pulumi.Input<k8s.types.input.core.v1.EnvVar>[]>;

  /**
   * List of sources to populate environment variables in the container. The keys defined within a source must be a C_IDENTIFIER. All invalid keys will be reported as an event when the container is starting. When a key exists in multiple sources, the value associated with the last source will take precedence. Values defined by an Env with a duplicate key will take precedence. Cannot be updated.
   */
  envFrom?: pulumi.Input<pulumi.Input<k8s.types.input.core.v1.EnvFromSource>[]>;

  /**
   * If applied, an ingress will be setup
   */
  host?: pulumi.Input<string>;

  /**
   * @default latest
   */
  tag?: pulumi.Input<string>;

  /**
   * @default info
   */
  logLevel?: pulumi.Input<string>;

  /**
   * Resources
   */
  resources: pulumi.Input<k8s.types.input.core.v1.ResourceRequirements>;

  healthCheck?: pulumi.Input<k8s.types.input.core.v1.Probe>;

  replicas?: pulumi.Input<number>;
}

export class AppComponent extends pulumi.ComponentResource {
  public readonly deployment: k8s.apps.v1.Deployment;
  public readonly service: k8s.core.v1.Service;

  public readonly ingress?: k8s.networking.v1.Ingress;

  constructor(
    name: string,
    args: AppComponentArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('tabetalt:app', name, {}, opts);

    const {
      image,
      env = [],
      envFrom = [],
      host,
      tag = 'latest',
      logLevel = 'info',
      port = 8000,
      resources,
      replicas = 1,
      healthCheck = {
        httpGet: {
          path: '/health',
          port,
        },
        initialDelaySeconds: 5,
        periodSeconds: 5,
      },
    } = args;

    const matchLabels = { app: name };

    this.deployment = new k8s.apps.v1.Deployment(
      name,
      {
        metadata: { name },
        spec: {
          replicas,
          selector: { matchLabels },
          template: {
            metadata: { labels: matchLabels },
            spec: {
              containers: [
                {
                  readinessProbe: healthCheck,
                  livenessProbe: healthCheck,
                  name,
                  resources,
                  image: interpolate`${image}:${tag}`,
                  imagePullPolicy: 'IfNotPresent',
                  ports: [{ containerPort: port }],
                  envFrom,

                  env: pulumi.output(env).apply(_env => [
                    {
                      name: 'PORT',
                      value: String(port),
                    },
                    {
                      name: 'LOG_LEVEL',
                      value: logLevel,
                    },
                    ..._env,
                  ]),
                },
              ],
            },
          },
        },
      },
      { parent: this, deleteBeforeReplace: true },
    );

    this.service = new k8s.core.v1.Service(
      name,
      {
        metadata: { name },
        spec: {
          ports: [{ port }],
          selector: this.deployment.spec.selector.matchLabels,
        },
      },
      { parent: this, deleteBeforeReplace: true },
    );

    if (host) {
      this.ingress = new k8s.networking.v1.Ingress(
        `${name}-ingress`,
        {
          metadata: {
            name,
            annotations: {
              'kubernetes.io/ingress.class': 'caddy',
            },
          },
          spec: {
            rules: [
              {
                host,
                http: {
                  paths: [
                    {
                      path: '/',
                      pathType: 'Prefix',
                      backend: {
                        service: {
                          name: this.service.metadata.name,
                          port: { number: port },
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        { parent: this, deleteBeforeReplace: true },
      );
    }
  }
}
