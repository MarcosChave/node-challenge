const { response } = require('express')
const express = require('express')
const app = express()
const uuid = require('uuid')
app.use(express.json())
const port = 3000

const clients = []

const checkId = (request, response, next) => {
  const { id } = request.params // Pegando o id

  const index = clients.findIndex(client => client.id === id) // Percorre iterando item por item e retornando o usario  expecífico dentro do array / Não encontrado retorna -1
  if (index < 0) {
    return response.status(404).json('User not found') //REsposta de erro caso não encontrar o usuário
  }

  request.clientIndex = index
  request.clientId = id
  next()
}

const methodAndUrl = (request, response, next) => {
  console.log(request.method)
  console.log(request.url)

  next()
}

app.get('/order', methodAndUrl, (request, response) => {
  return response.json(clients)
}) // Rota de armazenamento dos dados

app.get('/order/:id', checkId, methodAndUrl, (request, response) => {
  const { id } = request.params // Pega o id

  const index = clients.findIndex(client => client.id === id) // Percorre o array iterando item por item até encontrar o id específico, retornando.

  const pedidoEspecifico = clients[index] //diz que o array é o id encontrado no index

  return response.json(pedidoEspecifico)
}) // rota de dados específicos

app.post('/order', methodAndUrl, (request, response) => {
  const {
    order,
    lunch,
    clientName, // Os dados
    price,
    status
  } = request.body // Por onde chega os dados
  const client = { order, lunch, clientName, price, status, id: uuid.v4() }

  clients.push(client) //Adiciona a informação dentro do array

  return response.status(201).json(client)
}) //Rota de ciação dos dados

app.put('/order/:id', checkId, methodAndUrl, (request, response) => {
  const index = request.clientIndex
  const id = request.clientId
  const { order, lunch, clientName, price, status } = request.body // pegando as novas informações

  const updatedInformations = { id, order, lunch, clientName, price, status } // Montando as novas informações

  clients[index] = updatedInformations // Ao encontrar a posição do usuário, faz ela ser assumida pelo atualizado.

  return response.json(updatedInformations)
}) // rota de alteração de dados

app.delete('/order/:id', checkId, methodAndUrl, (request, response) => {
  const index = request.clientIndex
  clients.splice(index, 1)

  return response.status(204).json()
}) // rota para deletar dados

app.patch('/order/:id', checkId, methodAndUrl, (request, response) => {
  const index = request.clientIndex
  const changeStatus = clients[index] // Chamando o id específico
  changeStatus.status = 'Pronto' // alterando o status

  return response.json(changeStatus)
}) // rota mudar status

app.listen(port, () => {
  console.log(`🚀 Server started on ${port}`)
})
