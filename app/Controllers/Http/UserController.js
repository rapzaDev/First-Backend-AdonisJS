'use strict'

const User = use('App/Models/User')

class UserController {
  async store ({ request }) {
    const data = request.only(['username', 'email', 'password'])
    const address = request.input('address')

    const user = await User.create(data)

    await user.address().create(address)

    return user
  }
}

module.exports = UserController
