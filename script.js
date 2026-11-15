const form = document.getElementById('form-tarefa');
const input = document.getElementById('nova-tarefa');
const lista = document.getElementById('lista');
const contador = document.getElementById('contador');
const vazio = document.getElementById('vazio');
const botaoLimpar = document.getElementById('limpar');

// Array de objetos: cada tarefa tem id, texto e se está feita
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

function salvar() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function desenhar() {
    lista.innerHTML = '';

    tarefas.forEach(function (tarefa) {
        const item = document.createElement('li');
        item.classList.toggle('feita', tarefa.feita);

        const texto = document.createElement('span');
        texto.textContent = tarefa.texto;

        const excluir = document.createElement('button');
        excluir.textContent = 'Excluir';

        // Clicar na tarefa marca/desmarca como feita
        item.addEventListener('click', function () {
            tarefa.feita = !tarefa.feita;
            salvar();
            desenhar();
        });

        // Clicar em Excluir remove a tarefa
        excluir.addEventListener('click', function (evento) {
            evento.stopPropagation();
            tarefas = tarefas.filter(function (t) {
                return t.id !== tarefa.id;
            });
            salvar();
            desenhar();
        });

        item.append(texto, excluir);
        lista.appendChild(item);
    });

    const feitas = tarefas.filter(function (t) { return t.feita; }).length;
    contador.textContent = feitas + ' de ' + tarefas.length + ' concluídas';
    vazio.style.display = tarefas.length === 0 ? 'block' : 'none';
    botaoLimpar.style.display = feitas > 0 ? 'block' : 'none';
}

form.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const texto = input.value.trim();
    if (texto === '') return;

    tarefas.push({ id: Date.now(), texto: texto, feita: false });
    salvar();
    desenhar();
    form.reset();
    input.focus();
});

botaoLimpar.addEventListener('click', function () {
    tarefas = tarefas.filter(function (t) { return !t.feita; });
    salvar();
    desenhar();
});

desenhar();