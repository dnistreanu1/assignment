export default {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/dev.sqlite3'
    },
    migrations: {
      directory: './migrations'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: './data/dev.sqlite3'
    },
    migrations: {
      directory: './migrations'
    },
    useNullAsDefault: true
  }
};
