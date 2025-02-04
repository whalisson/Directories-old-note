// Função para carregar as matérias (e suas submatérias) salvas no LocalStorage
function carregarMaterias() {
    const listaMaterias = document.getElementById('listaMaterias');
    listaMaterias.innerHTML = ''; // Limpa a lista
  
    // Recupera as matérias do LocalStorage ou inicializa com objeto vazio
    const materias = JSON.parse(localStorage.getItem('materias')) || {};
  
    // Percorre as matérias e cria os elementos para exibição
    for (const [materia, dados] of Object.entries(materias)) {
      // Cria o elemento LI que conterá a matéria e suas submatérias
      const li = document.createElement('li');
      li.className = 'list-group-item';
  
      // Cria uma div para os controles da matéria (nome, mensagem e botão remover)
      const materiaRow = document.createElement('div');
      materiaRow.className = 'd-flex justify-content-between align-items-center';
  
      // Exibe o nome da matéria
      const nomeMateria = document.createElement('span');
      nomeMateria.textContent = `${materia}: `;
      materiaRow.appendChild(nomeMateria);
  
      // Campo para editar a mensagem da matéria
      const inputMensagem = document.createElement('input');
      inputMensagem.type = 'text';
      inputMensagem.className = 'form-control me-2';
      inputMensagem.style.flex = '1';
      inputMensagem.value = dados.mensagem || '';
      inputMensagem.placeholder = 'Digite uma mensagem';
      inputMensagem.onchange = () => salvarMensagem(materia, inputMensagem.value);
      materiaRow.appendChild(inputMensagem);
  
      // Botão para remover a matéria
      const botaoRemover = document.createElement('button');
      botaoRemover.className = 'btn btn-danger';
      botaoRemover.textContent = 'Remover';
      botaoRemover.onclick = () => removerMateria(materia);
      materiaRow.appendChild(botaoRemover);
  
      li.appendChild(materiaRow);
  
      // Seção de submatérias da matéria
      const submateriasContainer = document.createElement('div');
      submateriasContainer.className = 'submaterias-container mt-3 ps-3 border-start';
  
      // Título da área de submatérias
      const subTitle = document.createElement('h6');
      subTitle.textContent = 'Submatérias';
      subTitle.className = 'text-secondary';
      submateriasContainer.appendChild(subTitle);
  
      // Formulário para adicionar nova submatéria
      const subFormDiv = document.createElement('div');
      subFormDiv.className = 'input-group mb-2';
  
      const inputSubMateria = document.createElement('input');
      inputSubMateria.type = 'text';
      inputSubMateria.className = 'form-control';
      inputSubMateria.placeholder = 'Digite o nome da submatéria';
      subFormDiv.appendChild(inputSubMateria);
  
      const btnAddSub = document.createElement('button');
      btnAddSub.className = 'btn btn-success';
      btnAddSub.textContent = 'Adicionar';
      btnAddSub.onclick = () => {
        adicionarSubmateria(materia, inputSubMateria.value.trim());
        inputSubMateria.value = '';
      };
      subFormDiv.appendChild(btnAddSub);
  
      submateriasContainer.appendChild(subFormDiv);
  
      // Lista das submatérias cadastradas para esta matéria
      const subList = document.createElement('ul');
      subList.className = 'list-group';
  
      const submaterias = dados.submaterias || {};
      for (const [sub, subMsg] of Object.entries(submaterias)) {
        const liSub = document.createElement('li');
        liSub.className = 'list-group-item d-flex justify-content-between align-items-center';
  
        // Exibe o nome da submatéria
        const subName = document.createElement('span');
        subName.textContent = `${sub}: `;
        liSub.appendChild(subName);
  
        // Campo para editar a mensagem da submatéria
        const inputSubMsg = document.createElement('input');
        inputSubMsg.type = 'text';
        inputSubMsg.className = 'form-control me-2';
        inputSubMsg.style.flex = '1';
        inputSubMsg.value = subMsg || '';
        inputSubMsg.placeholder = 'Digite uma mensagem';
        inputSubMsg.onchange = () => salvarMensagemSub(materia, sub, inputSubMsg.value);
        liSub.appendChild(inputSubMsg);
  
        // Botão para remover a submatéria
        const btnRemoveSub = document.createElement('button');
        btnRemoveSub.className = 'btn btn-danger';
        btnRemoveSub.textContent = 'Remover';
        btnRemoveSub.onclick = () => removerSubmateria(materia, sub);
        liSub.appendChild(btnRemoveSub);
  
        subList.appendChild(liSub);
      }
  
      submateriasContainer.appendChild(subList);
      li.appendChild(submateriasContainer);
      listaMaterias.appendChild(li);
    }
  }
  
  // Função para adicionar uma nova matéria
  function adicionarMateria() {
    const inputMateria = document.getElementById('novaMateria');
    const novaMateria = inputMateria.value.trim();
    if (!novaMateria) return;
  
    // Recupera as matérias do LocalStorage e adiciona a nova, se ainda não existir
    const materias = JSON.parse(localStorage.getItem('materias')) || {};
    if (!materias[novaMateria]) {
      // Cria a matéria com mensagem vazia e sem submatérias
      materias[novaMateria] = { mensagem: '', submaterias: {} };
      localStorage.setItem('materias', JSON.stringify(materias));
      carregarMaterias();
    }
    inputMateria.value = ''; // Limpa o campo
  }
  
  // Função para salvar a mensagem de uma matéria
  function salvarMensagem(materia, mensagem) {
    const materias = JSON.parse(localStorage.getItem('materias')) || {};
    if (materias[materia]) {
      materias[materia].mensagem = mensagem;
      localStorage.setItem('materias', JSON.stringify(materias));
    }
  }
  
  // Função para remover uma matéria
  function removerMateria(materia) {
    const materias = JSON.parse(localStorage.getItem('materias')) || {};
    if (materias[materia]) {
      delete materias[materia];
      localStorage.setItem('materias', JSON.stringify(materias));
      carregarMaterias();
    }
  }
  
  // Função para adicionar uma nova submatéria à matéria especificada
  function adicionarSubmateria(materia, novaSubMateria) {
    if (!novaSubMateria) return;
    const materias = JSON.parse(localStorage.getItem('materias')) || {};
    if (materias[materia]) {
      // Se a submatéria ainda não existir, ela é criada com mensagem vazia
      if (!materias[materia].submaterias[novaSubMateria]) {
        materias[materia].submaterias[novaSubMateria] = '';
        localStorage.setItem('materias', JSON.stringify(materias));
        carregarMaterias();
      }
    }
  }
  
  // Função para salvar a mensagem de uma submatéria
  function salvarMensagemSub(materia, submateria, mensagem) {
    const materias = JSON.parse(localStorage.getItem('materias')) || {};
    if (materias[materia] && materias[materia].submaterias) {
      materias[materia].submaterias[submateria] = mensagem;
      localStorage.setItem('materias', JSON.stringify(materias));
    }
  }
  
  // Função para remover uma submatéria de uma matéria
  function removerSubmateria(materia, submateria) {
    const materias = JSON.parse(localStorage.getItem('materias')) || {};
    if (materias[materia] && materias[materia].submaterias) {
      delete materias[materia].submaterias[submateria];
      localStorage.setItem('materias', JSON.stringify(materias));
      carregarMaterias();
    }
  }
  
  // Carrega as matérias ao abrir a página
  window.onload = carregarMaterias;
  