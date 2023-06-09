import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config('common');

export const rootDomain = config.require('root-domain');
export const certificateEmail = config.requireSecret('certificate-email');

export const developers = config.requireObject<string[]>('developers');
export const admins = config.requireObject<string[]>('admins');
