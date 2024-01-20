/* eslint-disable camelcase */
const mapDBToUsersModel = ({
  id,
  username,
  password,
  fullname,
  created_at,
  updated_at,
}) => ({
  id,
  username,
  password,
  fullname,
  createdAt: created_at,
  updatedAt: updated_at,
});

module.exports = { mapDBToUsersModel };
