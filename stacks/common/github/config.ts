import { Config } from '@pulumi/pulumi';

const config = new Config('github');

export const token = config.requireSecret('token');
export const owner = config.require('owner');