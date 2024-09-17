const mainForm = document.querySelector('form') // Seleciona o elemento <form> e armazena em mainForm

void async function () { // Inicia uma função assíncrona autoexecutável
  const response = await fetch('/users') // Faz uma requisição GET para '/users'
  const users = await response.json() // Converte a resposta da requisição para JSON
  users.forEach(user => { // Itera sobre cada usuário na lista retornada
    const newForm = mainForm.cloneNode(true) // Clona o formulário principal para cada usuário
    newForm.name.value = user.name // Define o valor do campo name com o nome do usuário
    newForm.email.value = user.email // Define o valor do campo email com o e-mail do usuário
    newForm.dataset.id = user.id // Armazena o ID do usuário no dataset do formulário
    newForm.id.readOnly = true // Torna o campo id somente leitura
    mainForm.before(newForm) // Insere o novo formulário clonado antes do formulário principal
  })
  console.log(users) // Exibe os usuários no console para depuração
}()

document.addEventListener('submit', async (event) => { // Adiciona um listener para o evento submit
  event.preventDefault() // Impede o comportamento padrão de envio do formulário
  const action = event.submitter.dataset.action ?? null // Obtém a ação do botão (create, update, delete)
  const currentForm = event.target // Obtém o formulário que foi submetido

  if (action === 'delete') { // Se a ação for deletar
    const id = currentForm.dataset.id // Obtém o ID do formulário a ser deletado
    const method = 'DELETE' // Define o método HTTP como DELETE
    const url = `/users/${id}` // Cria a URL para deletar o usuário
    const response = await fetch(url, { method }) // Faz uma requisição DELETE
    if (!response.ok) // Verifica se a resposta foi bem-sucedida
      return console.error('Error:', response.statusText) // Exibe um erro no console se falhou
    currentForm.remove() // Remove o formulário do DOM se a deleção foi bem-sucedida
    return // Encerra a execução desta parte do código
  }

  if (action === 'update') { // Se a ação for atualizar
    const id = currentForm.dataset.id // Obtém o ID do formulário a ser atualizado
    const method = 'PUT' // Define o método HTTP como PUT
    const url = `/users/${id}` // Cria a URL para atualizar o usuário
    const headers = { 'Content-Type': 'application/json' } // Define o cabeçalho como JSON
    const name = currentForm.name.value // Obtém o valor do campo name
    const email = currentForm.email.value // Obtém o valor do campo email
    const body = JSON.stringify({ name, email }) // Cria o corpo da requisição com os dados do usuário
    const response = await fetch(url, { method, headers, body }) // Faz a requisição PUT
    if (!response.ok) // Verifica se a resposta foi bem-sucedida
      return console.error('Error:', response.statusText) // Exibe um erro no console se falhou
    const responseData = await response.json() // Converte a resposta para JSON
    currentForm.name.value = responseData.name // Atualiza o campo name com o valor retornado
    currentForm.email.value = responseData.email // Atualiza o campo email com o valor retornado
    return // Encerra a execução desta parte do código
  }

  if (action === 'create') { // Se a ação for criar
    const method = 'POST' // Define o método HTTP como POST
    const url = '/users' // Cria a URL para criar um novo usuário
    const headers = { 'Content-Type': 'application/json' } // Define o cabeçalho como JSON
    const name = currentForm.name.value // Obtém o valor do campo name
    const email = currentForm.email.value // Obtém o valor do campo email
    const body = JSON.stringify({ name, email }) // Cria o corpo da requisição com os dados do usuário
    const response = await fetch(url, { method, headers, body }) // Faz a requisição POST
    if (!response.ok) // Verifica se a resposta foi bem-sucedida
      return console.error('Error:', response.statusText) // Exibe um erro no console se falhou
    const responseData = await response.json() // Converte a resposta para JSON
    const newForm = mainForm.cloneNode(true) // Clona o formulário principal para o novo usuário
    newForm.name.value = responseData.name // Define o valor do campo name com o nome do novo usuário
    newForm.email.value = responseData.email // Define o valor do campo email com o e-mail do novo usuário
    newForm.dataset.id = responseData.id // Armazena o ID do novo usuário no dataset do formulário
    newForm.id.readOnly = true // Torna o campo id somente leitura
    mainForm.reset() // Limpa o formulário principal
    mainForm.before(newForm) // Insere o novo formulário clonado antes do formulário principal
    return // Encerra a execução desta parte do código
  }
})
