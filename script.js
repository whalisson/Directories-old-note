// Função para carregar matérias salvas no LocalStorage
function carregarMaterias() {
    const listaMaterias = document.getElementById('listaMaterias');
    listaMaterias.innerHTML = ''; // Limpa a lista

    // Recupera as matérias do LocalStorage
    const materias = JSON.parse(localStorage.getItem('materias')) || {};

    // Percorre as matérias e adiciona à lista
    for (const [materia, mensagem] of Object.entries(materias)) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        // Elemento para exibir a matéria
        const nomeMateria = document.createElement('span');
        nomeMateria.textContent = `${materia}: `;
        li.appendChild(nomeMateria);

        // Campo para editar a mensagem
        const inputMensagem = document.createElement('input');
        inputMensagem.type = 'text';
        inputMensagem.className = 'form-control me-2';
        inputMensagem.style.flex = '1';
        inputMensagem.value = mensagem || '';
        inputMensagem.placeholder = 'Digite uma mensagem';
        inputMensagem.onchange = () => salvarMensagem(materia, inputMensagem.value);
        li.appendChild(inputMensagem);

        // Botão para remover a matéria
        const botaoRemover = document.createElement('button');
        botaoRemover.className = 'btn btn-danger';
        botaoRemover.textContent = 'Remover';
        botaoRemover.onclick = () => removerMateria(materia);
        li.appendChild(botaoRemover);

        listaMaterias.appendChild(li);
    }
}

// Função para adicionar uma nova matéria
function adicionarMateria() {
    const inputMateria = document.getElementById('novaMateria');
    const novaMateria = inputMateria.value.trim();
    if (!novaMateria) return;

    // Recupera matérias do LocalStorage e adiciona a nova
    const materias = JSON.parse(localStorage.getItem('materias')) || {};
    if (!materias[novaMateria]) {
        materias[novaMateria] = ''; // Adiciona com mensagem vazia
        localStorage.setItem('materias', JSON.stringify(materias));
        carregarMaterias();
    }

    inputMateria.value = ''; // Limpa o campo
}

// Função para salvar a mensagem de uma matéria
function salvarMensagem(materia, mensagem) {
    const materias = JSON.parse(localStorage.getItem('materias')) || {};
    materias[materia] = mensagem;
    localStorage.setItem('materias', JSON.stringify(materias));
}

// Função para remover uma matéria
function removerMateria(materia) {
    const materias = JSON.parse(localStorage.getItem('materias')) || {};
    delete materias[materia];
    localStorage.setItem('materias', JSON.stringify(materias));
    carregarMaterias();
}

// Carrega as matérias ao abrir a página
window.onload = carregarMaterias;
