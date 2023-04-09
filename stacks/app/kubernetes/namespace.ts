import * as k8s from '@pulumi/kubernetes';
import { kubeconfig } from '../common-stack';
import { namespaceName } from './config';

const provider = new k8s.Provider('before-namespace-provider', {
  kubeconfig,
});

export const namespace = new k8s.core.v1.Namespace(
  'main-namespace',
  {
    metadata: {
      name: namespaceName,
    },
  },
  { provider },
);
