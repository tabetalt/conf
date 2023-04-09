import * as gcp from '@pulumi/gcp';
import { ApiServices } from '@tabetalt/infra-components';
import { billingAccountId, organizationId, projectId } from './config';

const nullProvider = new gcp.Provider('without-project', {});

export const project = new gcp.organizations.Project(
  'main-project',
  {
    projectId,
    orgId: organizationId,
    name: projectId,
    billingAccount: billingAccountId,
    autoCreateNetwork: false,
  },
  { provider: nullProvider },
);

export const apiServices = new ApiServices(
  'main',
  [
    'servicemanagement.googleapis.com',
    'servicecontrol.googleapis.com',
    'container.googleapis.com',
    'compute.googleapis.com',
    'dns.googleapis.com',
    'cloudresourcemanager.googleapis.com',
    'logging.googleapis.com',
    'stackdriver.googleapis.com',
    'monitoring.googleapis.com',
    'cloudtrace.googleapis.com',
    'clouderrorreporting.googleapis.com',
    'clouddebugger.googleapis.com',
    'cloudprofiler.googleapis.com',
    'sqladmin.googleapis.com',
    'cloudkms.googleapis.com',
    'cloudfunctions.googleapis.com',
    'cloudbuild.googleapis.com',
    'iam.googleapis.com',
    'iap.googleapis.com',
    'run.googleapis.com',
    'artifactregistry.googleapis.com',
  ],
  project.projectId,
  { provider: nullProvider },
);
