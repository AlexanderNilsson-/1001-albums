const CronJob = require('cron').CronJob;
//const socket = require('./socket');
const Model = require('../models/selected-albums');
const allAlbums = require('../albums.json');

let albumOfTheDay = null;

function startGetAlbumOfTheDayCronJob() {
    const job = new CronJob({
        cronTime: '0 0 4 * * 1,2,3,4,5',
        // cronTime: '* * * * * 0,1,2,3,4,5,6',
        onTick: async function() {
            currentlySelectedalbum = await calculateAlbumOfTheDay();
        },
        start: false
    });

    return job.start();
}

function setAlbumAsListenedCronJob() {
    const job = new CronJob({
        cronTime: '0 0 18 * * 1,2,3,4,5',
        // cronTime: '20,30,40,50 * * * * 1,2,3,4,5',
        onTick: async function() {
            setAsListened();
        },
        start: false
    });

    return job.start();
}

async function calculateAlbumOfTheDay() {

    // First look for an album that has been selected already but not marked as listened.
    // This could happen if we selected an album but service crashed/restarted before we listened to it
    const selectedButNotListenedAlbum = await Model.findOne({
        where: {
            listened: false
        }
    });

    if (selectedButNotListenedAlbum) {
        albumOfTheDay = allAlbums[selectedButNotListenedAlbum.id];
    } else {

        // Albums we have listened to so far
        const listenedAlbums = await Model.findAll({
            attributes: ['id'],
        }).map(i => i.get('id'));


        // Get keys from both of the above objects
        // Make sure this is an array as the DB might return NULL if empty
        const listenedAlbumsKeys = listenedAlbums ? listenedAlbums : [];
        const allAlbumsKeys = Object.keys(allAlbums);


        const filteredKeys = allAlbumsKeys.filter(function(key) {
            // Remove the album from possible keys if we already listened to it
            return listenedAlbumsKeys.indexOf(key) < 0;
        });


        // Then select a new album of the day
        albumOfTheDay = allAlbums[filteredKeys[filteredKeys.length * Math.random() << 0]];
        saveAlbumOfTheDay(Model, albumOfTheDay);
    }

    console.log('Album of the day is: ', albumOfTheDay)
    // emitAlbumOfTheDay(io, albumOfTheDay);
}

function emitAlbumOfTheDay(io, album) {
    io.emit('albumOfTheDay', {
        album: album
    });
}


function saveAlbumOfTheDay(Model, album) {
    Model.create({
        timestamp: new Date().getTime(),
        data: album,
        id: album.id,
        listened: false,
    });
}

function setAsListened() {
    if (!albumOfTheDay) {
        return;
    }
    Model.update({
        listened: true
    }, {where: {id: albumOfTheDay.id}});
}

function getAlbumOfTheDay() {
    return albumOfTheDay;
}

module.exports = {
    startGetAlbumOfTheDayCronJob,
    setAlbumAsListenedCronJob,
    calculateAlbumOfTheDay,
    getAlbumOfTheDay,
};

