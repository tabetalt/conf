import { Config } from '@pulumi/pulumi';

const config = new Config('google');

export const projectId = config.require('projectId');
export const region = config.require('region');
export const zone = config.require('zone');
export const organizationId = config.require('organization-id');
export const billingAccountId = config.require('billing-account-id');
