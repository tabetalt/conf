import * as k8s from '@pulumi/kubernetes';
import { kubeconfig } from '../common-stack';

export const provider = new k8s.Provider('k8s-provider', {
  kubeconfig,
});
