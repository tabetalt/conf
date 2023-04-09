import * as github from '@pulumi/github';
import { owner, token } from './config';

export const provider = new github.Provider('provider', {
  token,
  owner,
});
