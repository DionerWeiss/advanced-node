import './config/module-alias'
import { app } from '@/main/config/app'
import { env } from '@/main/config/env'

import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { config } from '@/infra/postgres/helpers'

createConnection(config)
  .then(() =>
    app.listen(env.port, () => console.log(`Server running at ${env.port}`))
  ).catch(console.error)
