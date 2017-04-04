const { hashPassword } = require('feathers-authentication-local').hooks
const { authenticate } = require('feathers-authentication').hooks
const { remove } = require('feathers-hooks-common')

module.exports = {
  before: {
    all: [],
    find: [
      authenticate('jwt')
    ],
    get: [
      authenticate('jwt')
    ],
    create: [
      hashPassword('password')
    ],
    update: [
      authenticate('jwt')
    ],
    patch: [
      authenticate('jwt')
    ],
    remove: [
      authenticate('jwt')
    ]
  },

  after: {
    all: [
      // TODO: pluck
      remove('password'),
      remove('email')
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
