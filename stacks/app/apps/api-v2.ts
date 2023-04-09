import * as google from '@pulumi/google-native';
import * as pulumi from '@pulumi/pulumi';
import { interpolate } from '@pulumi/pulumi';
import { AppComponent } from '@tabetalt/infra-components';
import {
  artifactRepoUrl,
  ingressIpAddress,
  rootDomain,
  zoneName,
} from '../common-stack';
import { provider as googleProvider } from '../google/provider';
import { provider as kubernetesProvider } from '../kubernetes/provider';

const config = new pulumi.Config('api-v2');
const subDomain = config.require('sub-domain');
const appDomain = interpolate`${subDomain}.${rootDomain}`;

new google.dns.v1.ResourceRecordSet(
  'api-v2',
  {
    managedZone: zoneName,
    name: interpolate`${appDomain}.`,
    ttl: 300,
    type: 'A',
    rrdatas: ingressIpAddress,
  },
  { provider: googleProvider, deleteBeforeReplace: true },
);

new AppComponent(
  'api',
  {
    image: interpolate`${artifactRepoUrl}/api-v2`,
    tag: config.require('tag'),
    host: appDomain,
    port: 8000,
    env: [{ name: 'SELF_URL', value: interpolate`https://${appDomain}` }],
    resources: {
      requests: {
        cpu: '100m',
        memory: '128Mi',
      },
      limits: {
        cpu: '200m',
        memory: '256Mi',
      },
    },
  },
  { provider: kubernetesProvider },
);
