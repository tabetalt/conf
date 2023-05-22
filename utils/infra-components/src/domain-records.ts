import * as google from '@pulumi/google-native';
import * as pulumi from '@pulumi/pulumi';

export interface DomainRecord {
  type: 'CNAME' | 'TXT' | 'A' | 'AAAA' | 'MX';
  name: pulumi.Input<string>;
  data: pulumi.Input<string>[];
}

export class DomainRecords extends pulumi.ComponentResource {
  constructor(
    name: string,
    records: DomainRecord[],
    managedZone: pulumi.Input<string>,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('tabetalt:api-services', name, records, opts);

    records.map(
      record =>
        new google.dns.v1.ResourceRecordSet(
          `${record.name}-${record.type}`,
          {
            managedZone,
            name: record.name,
            ttl: 300,
            type: record.type,
            rrdatas: record.data,
          },
          { parent: this, deleteBeforeReplace: true },
        ),
    );
  }
}
