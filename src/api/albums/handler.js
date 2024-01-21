/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');
const config = require('../../utils/config/config');
const ClientError = require('../../exceptions/ClientError');

class AlbumsHandler {
  constructor(service, songService, StorageService, validator, UploadsValidator) {
    this._service = service;
    this._songService = songService;
    this._storageService = StorageService;
    this._validator = validator;
    this._uploadsValidator = UploadsValidator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumsPayload(request.payload);
      const {
        name, year,
      } = request.payload;

      const albumId = await this._service.addAlbum({
        name, year,
      });

      const response = h.response({
        status: 'success',
        message: 'Album has been successfully added',
        data: {
          albumId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Falied, internal server error',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getAlbumsHandler() {
    const albums = await this._service.getAlbums();

    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;

    const album = await this._service.getAlbumById(id);
    album.songs = await this._songService.getSongByAlbumId(id);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request, h) {
    try {
      this._validator.validateAlbumsPayload(request.payload);
      const { id } = request.params;

      await this._service.editAlbumById(id, request.payload);

      return {
        status: 'success',
        message: 'Album has been successfully updated',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Falied, internal server error',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteAlbumById(id);
      return {
        status: 'success',
        message: 'Album has been successfully deleted',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Falied, internal server error',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async postUploadCoverHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;

    await this._service.checkAlbum(id);

    this._uploadsValidator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const fileLocation = `http://${config.app.host}:${config.app.port}/albums/covers/${filename}`;

    await this._service.editAlbumToAddCoverById(id, fileLocation);

    const response = h.response({
      status: 'success',
      message: 'Cover berhasil diupload',
    });

    response.code(201);
    return response;
  }

  async postLikesAlbumHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.checkAlbum(id);

    const like = await this._service.addLikeAndDislikeAlbum(id, credentialId);

    return h.response({
      status: 'success',
      message: `Berhasil ${like} Album`,
    }).code(201);
  }

  async getLikesAlbumByIdhandler(request, h) {
    const { id } = request.params;
    const { likes, source } = await this._service.getLikesAlbumById(id);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });

    response.header('X-Data-Source', source);
    return response;
  }

  async deleteLikesAlbumByIdhandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.checkAlbum(id);

    await this._service.unLikeAlbumById(id, credentialId);

    return h.response({
      status: 'success',
      message: 'Album batal disukai',
    }).code(200);
  }
}

module.exports = AlbumsHandler;
