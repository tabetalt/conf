import * as pulumi from '@pulumi/pulumi';

const stack = new pulumi.StackReference('common', {}, { protect: true });

export const kubeconfig = stack.requireOutput('kubeconfig');
