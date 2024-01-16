/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToSongsModel } = require('../../utils/mapDBToSongsModel');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, performer, genre, duration,
  }) {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if (title === undefined) {
      throw new InvariantError('Albums has fail to added');
    }
    if (year === undefined) {
      throw new InvariantError('Albums has fail to added');
    }
    if (performer === undefined) {
      throw new InvariantError('Albums has fail to added');
    }
    if (genre === undefined) {
      throw new InvariantError('Albums has fail to added');
    }
    if (duration === undefined) {
      throw new InvariantError('Albums has fail to added');
    }

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [id, title, year, performer, genre, duration, insertedAt, updatedAt],
    };
    console.log(query.values);
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Music has fail to added');
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query('SELECT id, title, performer FROM songs');
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Music not found');
    }

    return result.rows.map(mapDBToSongsModel)[0];
  }

  async editSongById(id, {
    title, year, performer, genre, duration,
  }) {
    if (title === undefined) {
      throw new InvariantError('Albums has fail to added');
    }
    if (year === undefined) {
      throw new InvariantError('Albums has fail to added');
    }
    if (performer === undefined) {
      throw new InvariantError('Albums has fail to added');
    }
    if (genre === undefined) {
      throw new InvariantError('Albums has fail to added');
    }
    if (duration === undefined) {
      throw new InvariantError('Albums has fail to added');
    }
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Music has fail to updated. Id is not found');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Music has fail to deleted. Id is not found');
    }
  }

  async getSongByAlbumId(albumId) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE albums_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapDBToSongsModel);
  }
}

module.exports = SongsService;
