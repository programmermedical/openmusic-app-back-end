// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

const Hapi = require('@hapi/hapi');

const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const albumsValidator = require('./validator/albums/index');

const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const songsValidator = require('./validator/songs/index');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsServices = new SongsService();

  const server = Hapi.server({
    // port: 5000,
    // host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        songsService: songsServices,
        validator: albumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsServices,
        validator: songsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
