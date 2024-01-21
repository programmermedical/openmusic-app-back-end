/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToAlbumsModel } = require('../../utils/mapDBToAlbumsModel');
const NotFoundError = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({
    name, year,
  }) {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, insertedAt, updatedAt],
    };
    console.log(query.values);
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Albums has fail to added');
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const query = 'SELECT * FROM albums';

    const result = await this._pool.query(query);

    return result.rows.map(mapDBToAlbumsModel);
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Albums not found');
    }

    return result.rows.map(mapDBToAlbumsModel)[0];
  }

  async editAlbumById(id, {
    name, year,
  }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Albums has fail to updated. Id is not found');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Albums has fail to deleted. Id is not found');
    }
  }

  async checkAlbum(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async editAlbumToAddCoverById(id, fileLocation) {
    const query = {
      text: 'UPDATE albums SET cover_url = $1 WHERE id = $2',
      values: [fileLocation, id],
    };

    await this._pool.query(query);
  }

  async addLikeAndDislikeAlbum(albumId, userId) {
    const like = 'like';

    const queryCheckLike = {
      text: 'SELECT id FROM user_likes_albums WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const resultCheckLike = await this._pool.query(queryCheckLike);

    if (resultCheckLike.rowCount) {
      throw new ClientError('TIdak dapat menambahkan like');
    } else {
      const id = `album-like-${nanoid(16)}`;

      const queryAddLike = {
        text: 'INSERT INTO user_likes_albums VALUES($1, $2, $3) RETURNING id',
        values: [id, userId, albumId],
      };

      await this._pool.query(queryAddLike);
      await this._cacheService.delete(`user_likes_albums:${albumId}`);
    }
    await this._cacheService.delete(`user_likes_albums:${albumId}`);
    return like;
  }

  async getLikesAlbumById(id) {
    try {
      const source = 'cache';
      const likes = await this._cacheService.get(`user_likes_albums:${id}`);
      return { likes: +likes, source };
    } catch (error) {
      await this.checkAlbum(id);

      const query = {
        text: 'SELECT * FROM user_likes_albums WHERE album_id = $1',
        values: [id],
      };

      const result = await this._pool.query(query);

      const likes = result.rowCount;

      await this._cacheService.set(`user_likes_albums:${id}`, likes);

      const source = 'server';

      return { likes, source };
    }
  }

  async unLikeAlbumById(albumId, userId) {
    const query = {
      text: 'SELECT id FROM user_likes_albums WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    const queryDeleteLike = {
      text: 'DELETE FROM user_likes_albums WHERE id = $1 RETURNING id',
      values: [result.rows[0].id],
    };

    await this._pool.query(queryDeleteLike);
    await this._cacheService.delete(`user_likes_albums:${albumId}`);
  }
}

module.exports = AlbumsService;
