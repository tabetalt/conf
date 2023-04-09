import * as fs from 'fs';
import * as github from '@pulumi/github';
import { provider } from './provider';

const repositoriesWithCommonWorkflows = ['api-v2', 'backoffice-v2'];

const files = [
  {
    name: 'issue-workflow.yml',
    content: fs.readFileSync(
      '../../common-workflows/issue-workflow.yml',
      'utf8',
    ),
  },
  {
    name: 'todo-to-issue.yml',
    content: fs.readFileSync(
      '../../common-workflows/todo-to-issue.yml',
      'utf8',
    ),
  },
];

repositoriesWithCommonWorkflows.map(repository =>
  files.map(
    file =>
      new github.RepositoryFile(
        `${repository}-${file.name}`,
        {
          repository,
          file: `.github/workflows/${file.name}`,
          content: file.content,
          commitMessage: 'chore: updated common workflows',
        },
        { provider },
      ),
  ),
);
