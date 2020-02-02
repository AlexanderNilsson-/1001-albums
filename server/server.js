const Koa = require('koa');
const db = require('./sequelize');
const app = new Koa();
const PORT = process.env.PORT || 8000;
const albumsService = require('./services/albums');


// Will fetch a new album each weekday at 6 in the morning
albumsService.startGetAlbumOfTheDayCronJob();

// Will mark the fetched album as listened
albumsService.setAlbumAsListenedCronJob();

app.use(async ctx => {
    const album = albumsService.getAlbumOfTheDay();
    ctx.body = album;
});

// Start Server
exports.start = () => new Promise(async (resolve, reject) => {

    try {
        const server = require('http').createServer(app.callback());

        server.listen(parseInt(PORT, 10), async function(err) {
            console.log('Server started at port', PORT);
            if (err) {
                return reject(err);
            }

            // Load and initialize the DB.
            await db.sync();
            await db.init();

            // Fetch an album unless we already have got one from our cronjob
            albumsService.calculateAlbumOfTheDay();

            return resolve();
        });

    } catch (err) {
        console.log('Error starting node server:', err);
        return reject(err);
    }

});

exports.stop = function() {
    app.close();
};
