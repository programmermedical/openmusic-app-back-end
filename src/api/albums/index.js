/* eslint-disable max-len */
const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {
    service, songService, StorageService, validator, UploadsValidator,
  }) => {
    const albumsHandler = new AlbumsHandler(service, songService, StorageService, validator, UploadsValidator);
    server.route(routes(albumsHandler));
  },
};
