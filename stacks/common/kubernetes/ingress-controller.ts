import * as k8s from '@pulumi/kubernetes';
import { certificateEmail } from '../config';
import { ipAddress } from '../google/ip-address';
import { provider } from './provider';

const namespace = new k8s.core.v1.Namespace(
  'caddy-system',
  {
    metadata: { name: 'caddy-system' },
  },
  { provider },
);

export const ingress = new k8s.helm.v3.Chart(
  'caddy-ingress',
  {
    chart: 'caddy-ingress-controller',
    fetchOpts: {
      repo: 'https://caddyserver.github.io/ingress/',
    },
    namespace: namespace.metadata.name,
    values: {
      ingressController: {
        config: {
          email: certificateEmail,
        },
      },
      loadBalancer: {
        loadBalancerIP: ipAddress.address,
      },

      resources: {
        requests: {
          cpu: '100m',
          memory: '128Mi',
        },
        limits: {
          cpu: '100m',
          memory: '128Mi',
        },
      },
    },
  },
  { provider },
);
