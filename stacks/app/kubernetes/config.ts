import { Config, getStack } from '@pulumi/pulumi';

export const config = new Config();

export const namespaceName = config.get('namespace-name') ?? getStack();
