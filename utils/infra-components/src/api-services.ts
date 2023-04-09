import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';

export class ApiServices extends pulumi.ComponentResource {
  constructor(
    name: string,
    apis: string[],
    projectId: pulumi.Input<string>,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('tabetalt:api-services', name, apis, opts);
    apis.map(
      service =>
        new gcp.projects.Service(
          `${name}-${service}`,
          {
            service,
            project: projectId,
            disableOnDestroy: false,
          },
          { parent: this },
        ),
    );
  }
}
