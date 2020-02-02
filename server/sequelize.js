const Sequelize = require('sequelize');

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT } = process.env;

const sequelize = new Sequelize('1001-albums', POSTGRES_USER, POSTGRES_PASSWORD, {

    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    dialect: 'postgres',

    logging: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});


const init = async () => {

    return sequelize
        .authenticate()
        .then(() => {
            console.log('Succesfully connected to the DB');
        })
        .catch(err => {
            console.log('Unable to connect to the database service:', err);
            process.exit(1);
        });

};

const sync = () => {
    return sequelize.sync();
};

exports.sync = sync;
exports.init = init;
exports.sequelize = sequelize;
exports.Sequelize = Sequelize;

