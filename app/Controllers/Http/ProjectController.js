'use strict'

const Project = use('App/Models/Project')
class ProjectController {
  async index ({ request, response, view }) {
    const projects = await Project.query()
      .with('user')
      .fetch()

    return projects
  }

  async store ({ request, auth }) {
    const data = request.only(['title', 'description'])

    const project = await Project
      .create({ ...data, user_id: auth.user.id })

    return project
  }

  async show ({ params, response }) {
    try {
      const project = await Project.findOrFail(params.id)

      await project.load('user')
      await project.load('tasks')

      return project
    } catch (error) {
      return response.status(400)
        .send({ error: { message: 'Não foi possivel encontrar o Projeto' } })
    }
  }

  async update ({ params, request, response }) {
    try {
      const project = await Project.findOrFail(params.id)

      const data = request.only(['title', 'description'])

      project.merge(data)

      await project.save()

      return project
    } catch (error) {
      return response.status(400).send({ error: { message: 'Não foi possivel fazer o update do Projeto' } })
    }
  }

  async destroy ({ params, response }) {
    const project = await Project.findOrFail(params.id)

    await project.delete()

    return response.status(200).send({ message: 'Projeto deletado' })
  }
}

module.exports = ProjectController
