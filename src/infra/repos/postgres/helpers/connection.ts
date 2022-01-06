import { ConnectionNotFoundError } from '@/infra/repos/postgres/helpers'
import { createConnection, getConnection, getConnectionManager, QueryRunner } from 'typeorm'

export class PgConnection {
  private static instance?: PgConnection
  private query?: QueryRunner

  private constructor () {

  }

  static getInstance (): PgConnection {
    if (PgConnection.instance === undefined) PgConnection.instance = new PgConnection()

    return PgConnection.instance
  }

  async connect (): Promise<void> {
    const connection = getConnectionManager().has('default')
      ? getConnection()
      : await createConnection()

    this.query = connection.createQueryRunner()
  }

  async disconnect (): Promise<void> {
    if (this.query === undefined) throw new ConnectionNotFoundError()
    await getConnection().close()
    this.query = undefined
  }

  async openTransaction (): Promise<void> {
    if (this.query === undefined) throw new ConnectionNotFoundError()
    await this.query.startTransaction()
  }

  async closeTransaction (): Promise<void> {
    if (this.query === undefined) throw new ConnectionNotFoundError()
    await this.query.release()
  }

  async commit (): Promise<void> {
    if (this.query === undefined) throw new ConnectionNotFoundError()
    await this.query.commitTransaction()
  }

  async rollback (): Promise<void> {
    if (this.query === undefined) throw new ConnectionNotFoundError()
    await this.query.rollbackTransaction()
  }
}
