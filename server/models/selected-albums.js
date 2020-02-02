const db = require('../sequelize');

const Albums = db.sequelize.define('SelectedAlbums', {
    timestamp: db.Sequelize.STRING,
    data: db.Sequelize.JSONB,
    id: {
        type: db.Sequelize.STRING,
        primaryKey: true
    },
    listened: db.Sequelize.BOOLEAN
    }, {
        freezeTableName: true
    }
);

module.exports = Albums;


