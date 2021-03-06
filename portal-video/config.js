var configs = {};
configs.applicationPort = process.env.PORT || 5000;
configs.dbName = process.env.NODE_ENV === 'production'
    ? process.env.DB_NAME
    : process.env.DB_NAME_DEV;
configs.dbHost = process.env.NODE_ENV === 'production'
    ? process.env.DB_HOST
    : process.env.DB_HOST_DEV;

module.exports = configs;