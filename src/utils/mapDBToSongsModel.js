/* eslint-disable camelcase */
const mapDBToSongsModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  inserted_at,
  updated_at,
  albums_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted_at,
  updatedAt: updated_at,
  albums_id,
});

module.exports = { mapDBToSongsModel };
