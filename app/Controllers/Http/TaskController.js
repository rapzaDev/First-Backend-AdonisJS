'use strict'

const Task = use('App/Models/Task')

class TaskController {
  async index ({ params, response }) {
    try {
      const tasks = await Task.query()
        .where('project_id', params.projects_id)
        .with('user')
        .fetch()

      return tasks
    } catch (error) {
      return response.status(400)
        .send({ error: { message: `Não foi possivel listar as tarefas do projeto: ${params.projects_id}` } })
    }
  }

  async store ({ params, request, response }) {
    try {
      const data = request.only([
        'user_id',
        'title',
        'description',
        'due_date',
        'file_id'
      ])

      const task = await Task.create({
        ...data,
        project_id: params.projects_id
      })

      return task
    } catch (error) {
      return response.status(400)
        .send({ error: { message: 'Não foi possivel criar a tarefa' } })
    }
  }

  async show ({ params, response }) {
    try {
      const task = await Task.findOrFail(params.id)

      return task
    } catch (error) {
      return response.status(400)
        .send({ error: { message: `Não foi possivel listar a tarefa: ${params.id}` } })
    }
  }

  async update ({ params, request, response }) {
    try {
      const task = await Task.findOrFail(params.id)

      const data = request.only([
        'user_id',
        'title',
        'description',
        'due_date',
        'file_id'
      ])

      task.merge(data)

      await task.save()

      return task
    } catch (error) {
      return response.status(400)
        .send({ error: { message: `Não foi possivel atualizar a tarefa: ${params.id}` } })
    }
  }

  async destroy ({ params, response }) {
    const task = await Task.findOrFail(params.id)

    await task.delete()

    return response.status(200)
      .send({ message: `Tarefa: ${params.id} deletada com sucesso` })
  }
}

module.exports = TaskController
