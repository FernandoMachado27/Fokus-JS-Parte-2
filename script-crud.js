const taskListContainer = document.querySelector('.app__section-task-list');

const formTask = document.querySelector('.app__form-add-task');
const toggleFormTaskBtn = document.querySelector('.app__button--add-task'); // toggle -> alternar visualização, form visivel
const formLabel = document.querySelector('.app__form-label');

const textarea = document.querySelector('.app__form-textarea');

const btnCancelFormTask = document.querySelector('.app__form-footer__button--cancel');

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
const limparForm = () => {
    textarea.value = ''; // toda vez que a função for chamada o campo de texto virá vazio
    formTask.classList.add('hidden'); // oculta o formulário
}

function createTask(tarefa) {
    const li = document.createElement('li'); // criando item de lista no js para jogar no html
    li.classList.add('app__section-task-list-item'); // adicionando uma claase para esta lista

    const svgIcon = document.createElement('svg'); // criamos o icone que vai dentro da lista
    svgIcon.innerHTML = taskIconSvg;

    const paragraph = document.createElement('p'); // cria a partir da tag paragrafo
    paragraph.classList.add('app__section-task-list-item-description');

    paragraph.textContent = tarefa.descricao;

    li.appendChild(svgIcon);
    li.appendChild(paragraph);

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
    const task = {
        descricao: textarea.value,
        concluida: false
    }
    tarefas.push(task);
    const taskItem = createTask(task);
    taskListContainer.append(taskItem) // append para mostrar na pag HTML

    updateLocalStorage();
    limparForm();
})
