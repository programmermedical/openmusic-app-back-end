/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class UsersHandler {
  constructor(UsersService, UsersValidator) {
    this._usersService = UsersService;
    this._usersValidator = UsersValidator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    this._usersValidator.validateUserPayload(request.payload);

    const { username, password, fullname } = request.payload;

    const userId = await this._usersService.addUser({ username, password, fullname });

    const response = h.response({
      status: 'success',
      message: 'User has been successfull added',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async getUserByIdHandler(request, h) {
    const { id } = request.params;

    const users = await this._usersService.getUserById(id);

    return h.response({
      status: 'success',
      data: {
        users,
      },
    });
  }

  async getUserByUsernameHandler(request, h) {
    const { username = '' } = request.query;

    const users = await this._usersService.getUserByUsername(username);

    return h.response({
      status: 'success',
      data: {
        users,
      },
    });
  }
}

module.exports = UsersHandler;
