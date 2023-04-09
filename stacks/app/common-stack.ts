import * as pulumi from '@pulumi/pulumi';

const stack = new pulumi.StackReference('common', {}, { protect: true });

export const kubeconfig = stack.requireOutput('kubeconfig');
export const rootDomain = stack.requireOutput('rootDomain');
export const artifactRepoUrl = stack.requireOutput('artifactRepoUrl');
export const zoneName = stack.requireOutput('zoneName');
export const ingressIpAddress = stack.requireOutput('ingressIpAddress');
