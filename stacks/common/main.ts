import * as pulumi from '@pulumi/pulumi';
import './github';
import './google/artifact-registry';
import './google/project';
import './google/dns';
import './google/identity-pool';
import './kubernetes/ingress-controller';
import './kubernetes/postgres-operator';
import './repositories-with-containers';
import { cluster } from './google/gke';

export const kubeconfig = pulumi.secret(cluster.getKubeconfig());