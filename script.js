// Função para carregar as matérias (e suas submatérias) salvas no LocalStorage
function carregarMaterias() {
    const listaMaterias = document.getElementById('listaMaterias');
    listaMaterias.innerHTML = ''; // Limpa a lista
  
    // Recupera as matérias do LocalStorage ou inicializa com objeto vazio
    const materiasRaw = JSON.parse(localStorage.getItem('materias')) || {};
    const materias = {};
    let modificou = false;
    // Migração: se os dados estiverem no formato antigo, converte para o novo formato
    for (const [chave, valor] of Object.entries(materiasRaw)) {
      if (typeof valor !== 'object' || !valor.submaterias) {
        materias[chave] = {
          mensagem: valor,
          submaterias: {}
        };
        modificou = true;
      } else {
        materias[chave] = valor;
      }
    }
    if (modificou) {
      localStorage.setItem('materias', JSON.stringify(materias));
    }
  
    // Percorre as matérias para criar os elementos de interface
    for (const [materia, dados] of Object.entries(materias)) {
      const li = document.createElement('li');
      li.className = 'list-group-item';
  
      // Linha da matéria (nome, mensagem e botões)
      const materiaRow = document.createElement('div');
      materiaRow.className = 'd-flex justify-content-between align-items-center';
  
      // Container para o nome da matéria e o botão de editar
      const containerMateria = document.createElement('div');
      containerMateria.className = 'd-flex align-items-center';
      const spanMateria = document.createElement('span');
      spanMateria.textContent = `${materia}: `;
      containerMateria.appendChild(spanMateria);
  
      // Botão de editar matéria (ícone de lápis)
      const btnEditarMateria = document.createElement('button');
      btnEditarMateria.className = 'btn btn-link p-0 ms-2';
      btnEditarMateria.innerHTML = '✏️';
      btnEditarMateria.title = 'Editar matéria';
      btnEditarMateria.onclick = () => editarMateria(materia);
      containerMateria.appendChild(btnEditarMateria);
  
      materiaRow.appendChild(containerMateria);
  
      // Campo para editar a mensagem da matéria
      const inputMensagem = document.createElement('input');
      inputMensagem.type = 'text';
      inputMensagem.className = 'form-control me-2';
      inputMensagem.style.flex = '1';
      inputMensagem.value = dados.mensagem || '';
      inputMensagem.placeholder = 'Digite uma mensagem';
      inputMensagem.onchange = () => salvarMensagem(materia, inputMensagem.value);
      materiaRow.appendChild(inputMensagem);
  
      // Botão para remover a matéria (ícone de x)
      const botaoRemover = document.createElement('button');
      botaoRemover.className = 'btn btn-danger';
      botaoRemover.innerHTML = '❌';
      botaoRemover.title = 'Remover matéria';
      botaoRemover.onclick = () => removerMateria(materia);
      materiaRow.appendChild(botaoRemover);
  
      li.appendChild(materiaRow);
  
      // Seção de submatérias da matéria
      const submateriasContainer = document.createElement('div');
      submateriasContainer.className = 'submaterias-container mt-3 ps-3 border-start';
  
      // Título para a área de submatérias
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
  
      // Lista de submatérias cadastradas para esta matéria
      const subList = document.createElement('ul');
      subList.className = 'list-group';
  
      const submaterias = dados.submaterias || {};
      for (const [sub, subMsg] of Object.entries(submaterias)) {
        const liSub = document.createElement('li');
        liSub.className = 'list-group-item d-flex justify-content-between align-items-center';
  
        // Container para o nome da submatéria e o botão de editar
        const containerSub = document.createElement('div');
        containerSub.className = 'd-flex align-items-center';
        const subName = document.createElement('span');
        subName.textContent = `${sub}: `;
        containerSub.appendChild(subName);
  
        // Botão para editar submatéria (ícone de lápis)
        const btnEditarSub = document.createElement('button');
        btnEditarSub.className = 'btn btn-link p-0 ms-2';
        btnEditarSub.innerHTML = '✏️';
        btnEditarSub.title = 'Editar submatéria';
        btnEditarSub.onclick = () => editarSubmateria(materia, sub);
        containerSub.appendChild(btnEditarSub);
  
        liSub.appendChild(containerSub);
  
        // Campo para editar a mensagem da submatéria
        const inputSubMsg = document.createElement('input');
        inputSubMsg.type = 'text';
        inputSubMsg.className = 'form-control me-2';
        inputSubMsg.style.flex = '1';
        inputSubMsg.value = subMsg || '';
        inputSubMsg.placeholder = 'Digite uma mensagem';
        inputSubMsg.onchange = () => salvarMensagemSub(materia, sub, inputSubMsg.value);
        liSub.appendChild(inputSubMsg);
  
        // Botão para remover a submatéria (ícone de x)
        const btnRemoveSub = document.createElement('button');
        btnRemoveSub.className = 'btn btn-danger';
        btnRemoveSub.innerHTML = '❌';
        btnRemoveSub.title = 'Remover submatéria';
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
  
    const materias = JSON.parse(localStorage.getItem('materias')) || {};
    if (!materias[novaMateria]) {
      materias[novaMateria] = { mensagem: '', submaterias: {} };
      localStorage.setItem('materias', JSON.stringify(materias));
      carregarMaterias();
    }
    inputMateria.value = '';
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
  
    // Se a matéria estiver no formato antigo, migra para o novo formato
    if (materias[materia] && (typeof materias[materia] !== 'object' || !materias[materia].submaterias)) {
      materias[materia] = {
        mensagem: materias[materia],
        submaterias: {}
      };
    }
  
    if (materias[materia]) {
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
  
  // Função para remover uma submatéria
  function removerSubmateria(materia, submateria) {
    const materias = JSON.parse(localStorage.getItem('materias')) || {};
    if (materias[materia] && materias[materia].submaterias) {
      delete materias[materia].submaterias[submateria];
      localStorage.setItem('materias', JSON.stringify(materias));
      carregarMaterias();
    }
  }
  
  // Função para editar o nome de uma matéria
  function editarMateria(materia) {
    const materias = JSON.parse(localStorage.getItem('materias')) || {};
    const novoNome = prompt("Edite o nome da matéria:", materia);
    if (novoNome && novoNome.trim() !== "" && novoNome !== materia) {
      if (materias[novoNome]) {
        alert("Já existe uma matéria com este nome!");
      } else {
        materias[novoNome] = materias[materia];
        delete materias[materia];
        localStorage.setItem('materias', JSON.stringify(materias));
        carregarMaterias();
      }
    }
  }
  
  // Função para editar o nome de uma submatéria
  function editarSubmateria(materia, submateria) {
    const materias = JSON.parse(localStorage.getItem('materias')) || {};
    const novoSubNome = prompt("Edite o nome da submatéria:", submateria);
    if (novoSubNome && novoSubNome.trim() !== "" && novoSubNome !== submateria) {
      if (materias[materia].submaterias[novoSubNome]) {
        alert("Já existe uma submatéria com este nome!");
      } else {
        materias[materia].submaterias[novoSubNome] = materias[materia].submaterias[submateria];
        delete materias[materia].submaterias[submateria];
        localStorage.setItem('materias', JSON.stringify(materias));
        carregarMaterias();
      }
    }
  }
  
  // Carrega as matérias ao abrir a página
  window.onload = carregarMaterias;
  