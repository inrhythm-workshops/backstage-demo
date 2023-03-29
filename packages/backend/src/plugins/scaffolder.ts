import { CatalogClient } from '@backstage/catalog-client';
import { ScmIntegrations } from '@backstage/integration';
import { createRouter, createBuiltinActions } from '@backstage/plugin-scaffolder-backend';
import { createHttpBackstageAction } from '@roadiehq/scaffolder-backend-module-http-request';
import { createAwsS3CpAction } from '@roadiehq/scaffolder-backend-module-aws';
import { Router } from 'express';
import type { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({
    discoveryApi: env.discovery,
  });

  const integrations = ScmIntegrations.fromConfig(env.config);

  const actions = [
    createHttpBackstageAction({ discovery: env.discovery }),
    createAwsS3CpAction(),
    ...createBuiltinActions({
      integrations,
      config: env.config,
      catalogClient,
      reader: env.reader,
    }),
  ];

  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
    catalogClient,
    actions,
    identity: env.identity,
  });
}
