import { ConnectionOptions } from 'typeorm'

export const config: ConnectionOptions = {
  type: 'postgres',
  host: 'kesavan.db.elephantsql.com',
  port: 5432,
  username: 'wvdfacrm',
  password: 'LRnz71EGCI_6ad4KT7lCDEOV53f6qcc4',
  database: 'wvdfacrm',
  entities: ['dist/infra/postgres/entities/index.js']
}
