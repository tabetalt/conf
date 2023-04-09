import * as k8s from '@pulumi/kubernetes';
import { kubeconfig } from '../common-stack';
import { namespace } from './namespace';

export const provider = new k8s.Provider(
  'k8s-provider',
  {
    kubeconfig,
    namespace: namespace.metadata.name,
  },
  { dependsOn: namespace },
);
