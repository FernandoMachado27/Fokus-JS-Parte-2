const taskListContainer = document.querySelector('.app__section-task-list');

const formTask = document.querySelector('.app__form-add-task');
const toggleFormTaskBtn = document.querySelector('.app__button--add-task'); // toggle -> alternar visualização, form visivel
const formLabel = document.querySelector('.app__form-label');

const textarea = document.querySelector('.app__form-textarea');

const btnCancelFormTask = document.querySelector('.app__form-footer__button--cancel');

const taskAtiveDescription = document.querySelector('.app__section-active-task-description');

const localStorageTarefas = localStorage.getItem('tarefas'); // puxa algo salvo do localStorage com get

let tarefas = localStorageTarefas ? JSON.parse(localStorageTarefas) : []; // condicional ternaria, se tiver uma tarefa salva puxa string e transforma em obj js, se não fica como vazio

const taskIconSvg = `
<svg class="app_section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF" />
    <path
        d = "M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L19 16.17192"
        fill="#01080E" />
</svg>
`

let tarefaSelecionada = null;
let itemTarefaSelecionada = null;

let tarefaEmEdicao = null;
let paragraphEmEdicao = null;

const selecionaTarefa = (tarefa, elemento) => {
    if(tarefa.concluida){
        return;
    }

    document.querySelectorAll('.app__section-task-list-item-active').forEach(function
    (button) {
        button.classList.remove('app_section-task-list-item-active');
    })

    if(tarefaSelecionada == tarefa) {
        taskAtiveDescription.textContent = null;
        itemTarefaSelecionada = null;
        tarefaSelecionada = null;
        return
    }

    tarefaSelecionada = tarefa;
    itemTarefaSelecionada = elemento;
    taskAtiveDescription.textContent = tarefa.descricao;
    elemento.classList.add('app__section-task-list-item-active');

} // função para mostrar tarefa

const limparForm = () => {
    tarefaEmEdicao = null;
    paragraphEmEdicao = null;

    textarea.value = ''; // toda vez que a função for chamada o campo de texto virá vazio
    formTask.classList.add('hidden'); // oculta o formulário
}

const selecionaTarefaParaEditar = (tarefa, elemento) => { 
    if(tarefaEmEdicao == tarefa){
        limparForm();
        return;
    }

    formLabel.textContent = 'Editando tarefa';
    tarefaEmEdicao = tarefa;
    paragraphEmEdicao = elemento;
    textarea.value = tarefa.descricao;
    formTask.classList.remove('hidden');
}

function createTask(tarefa) {
    const li = document.createElement('li'); // criando item de lista no js para jogar no html
    li.classList.add('app__section-task-list-item'); // adicionando uma claase para esta lista

    const svgIcon = document.createElement('svg'); // criamos o icone que vai dentro da lista
    svgIcon.innerHTML = taskIconSvg;

    const paragraph = document.createElement('p'); // cria a partir da tag paragrafo
    paragraph.classList.add('app__section-task-list-item-description');

    paragraph.textContent = tarefa.descricao;

    const button = document.createElement('button'); // botão de concluido

    button.classList.add('app_button-edit'); // criando classe
    const editIcon = document.createElement('img'); // cria um elemento img na tela
    editIcon.setAttribute('src', '/imagens/edit.png'); // adiciona um valor ao elemento

    button.appendChild(editIcon);

    button.addEventListener('click', (event) => {
        event.stopPropagation();
        selecionaTarefaParaEditar(tarefa, paragraph);
    })

    li.onclick = () => {
        selecionaTarefa(tarefa, li);
    } // quando a tarefa receber um click, vai chamar a função de selecionar tarefa

    svgIcon.addEventListener('click', (event) => {
        if(tarefa==tarefaSelecionada){
            button.setAttribute('disable', true);
            event.stopPropagation();
            li.classList.add('app__section-task-list-item-complete');
            tarefaSelecionada.concluida = true;
            updateLocalStorage();
        }

    }) // tarefa concluida ou não

    if(tarefa.concluida){
        button.setAttribute('disable', true);
        li.classList.add('app__section-task-list-item-complete');
    }

    li.appendChild(svgIcon);
    li.appendChild(paragraph);
    li.appendChild(button);

    return li;
}

tarefas.forEach(task => {
    const taskItem = createTask(task);
    taskListContainer.appendChild(taskItem);
});

btnCancelFormTask.addEventListener('click',  () => {
    formTask.classList.add('hidden');
    limparForm();
})

toggleFormTaskBtn.addEventListener('click', () => {
    formLabel.textContent = 'Adicionando tarefa';
    formTask.classList.toggle('hidden')
}); // quando evento de click form executado, vai ser executado uma função

const updateLocalStorage = () => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas)); // transforma obj js em uma string
} // passando algo para o local storage

formTask.addEventListener('submit', (evento) => {
    evento.preventDefault();
    if(tarefaEmEdicao) {
        tarefaEmEdicao.descricao = textarea.value; // o titulo da tarefa vai receber o novo valor que o usuario escreveu
        paragraphEmEdicao.textContent = textarea.value;
    } else{
        const task = {
            descricao: textarea.value,
            concluida: false
        }
        tarefas.push(task);
        const taskItem = createTask(task);
        taskListContainer.append(taskItem) // append para mostrar na pag HTML
    }
    updateLocalStorage();
    limparForm();
})

document.addEventListener('TarefaFinalizada', function (e) {
    if(tarefaSelecionada){
        tarefaSelecionada.concluida = true;
        itemTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        itemTarefaSelecionada.querySelector('button').setAttribute('disabled', true);
        updateLocalStorage();
    }
})
