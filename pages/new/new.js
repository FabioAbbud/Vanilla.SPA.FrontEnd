// Cria uma string vazia com uma opção padrão para um elemento <select>
var ownerOptions = '<option value="">-- Selecione --</option>';

// Define a função myHome()
function myHome() {
    // Muda o título da página para 'Novo Documento'
    changeTitle('Novo Documento');
    
    // Obtém as opções dos proprietários para um elemento <select>
    getOwnersToSelect();
    
    // Verifica se a aba aberta está definida na sessionStorage, se não estiver, define como 'item'
    if (sessionStorage.openTab == undefined)
        sessionStorage.openTab = 'item'
    
    // Mostra a aba específica com base na sessionStorage
    showTab(sessionStorage.openTab);
    
    // Define a ação de clique do botão 'Novo Proprietário' para exibir a aba 'owner'
    $('#btnNewOwner').click(() => { showTab('owner') });
    
    // Define a ação de clique do botão 'Novo Item' para exibir a aba 'item'
    $('#btnNewItem').click(() => { showTab('item'); });
    
    // Define a submissão do formulário dentro das abas
    $('.tabs form').submit(sendData);
}

// Define a função para enviar os dados do formulário
function sendData(ev) {
    // Previne o comportamento padrão do formulário
    ev.preventDefault();

    // Cria um objeto para armazenar os dados do formulário
    var formJSON = {};
    
    // Obtém os dados do formulário
    const formData = new FormData(ev.target);
    
    // Converte os dados do formulário para um objeto JSON
    formData.forEach((value, key) => {
        formJSON[key] = stripTags(value);
        $('#' + key).val(formJSON[key]);
    });

    // Verifica se algum campo do formulário está vazio e impede o envio caso esteja
    for (const key in formJSON)
        if (formJSON[key] == '')
            return false;

    // Salva os dados no servidor
    saveData(formJSON);
    return false;
}

// Define a função para salvar os dados no servidor
function saveData(formJSON) {
    // Define a URL para fazer a requisição com base no tipo de dados (item ou owner)
    requestURL = `${app.apiBaseURL}/${formJSON.type}s`;
    delete formJSON.type;

    // Se o tipo for owner, renomeia a chave 'ownerName' para 'name'
    if (formJSON.ownerName != undefined) {
        formJSON['name'] = formJSON.ownerName;
        delete formJSON.ownerName;
    }

    // Se o tipo for item, renomeia a chave 'itemName' para 'name'
    if (formJSON.itemName != undefined) {
        formJSON['name'] = formJSON.itemName;
        delete formJSON.itemName;
    }

    // Faz uma requisição AJAX usando jQuery para enviar os dados para o servidor
    $.ajax({
        type: "POST",
        url: requestURL,
        data: JSON.stringify(formJSON),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    })
    // Se a requisição for bem-sucedida, exibe uma mensagem de sucesso
        .done(() => {
            viewHTML = `
                <form>
                    <h3>Oba!</h3>
                    <p>Cadastro efetuado com sucesso.</p>
                    <p>Obrigado...</p>
                </form>
            `;
        })
        // Se a requisição falhar, exibe uma mensagem de erro
        .fail((error) => {
            console.error('Erro:', error.status, error.statusText, error.responseJSON);
            viewHTML = `
                <form>
                    <h3>Oooops!</h3>
                    <p>Não foi possível realizar o cadastro. Ocorreu uma falha no servidor.</p>
                </form>
            `;
        })
        // Executa independentemente do resultado da requisição e atualiza a interface
        .always(() => {
            $('.tabBlock').html(viewHTML);
            $('#formNewOwner').trigger('reset');
            $('#formNewItem').trigger('reset');
        });

    return false;
}

// Define a função para mostrar a aba específica
function showTab(tabName) {
    // Reseta os formulários das abas
    $('#formNewOwner').trigger('reset');
    $('#formNewItem').trigger('reset');

    // Mostra a aba do proprietário ou do item, dependendo do parâmetro passado
    switch (tabName) {
        case 'owner':
            $('#tabOwner').show();
            $('#tabItem').hide();
            $('#btnNewOwner').attr('class', 'active');
            $('#btnNewItem').attr('class', 'inactive');
            sessionStorage.openTab = 'owner';
            break;
        case 'item':
            $('#tabItem').show();
            $('#tabOwner').hide();
            $('#btnNewItem').attr('class', 'active');
            $('#btnNewOwner').attr('class', 'inactive');
            sessionStorage.openTab = 'item';
            break;
    }
}

// Define a função para obter as opções de proprietários para um elemento <select>
function getOwnersToSelect() {
    // Define a URL para obter os proprietários
    requestURL = `${app.apiBaseURL}/owners`;

    // Faz uma requisição GET para obter os dados dos proprietários
    $.get(requestURL)
        .done((apiData) => {
            // Itera sobre os dados dos proprietários e cria as opções para o elemento <select>
            apiData.forEach((item) => {
                ownerOptions += `<option value="${item.id}">${item.id} - ${item.name}</option>`;
            });

            // Adiciona as opções ao elemento <select>
            $('#owner').html(ownerOptions);
        })
        // Se a requisição falhar, exibe um erro no console
        .fail((error) => {
            console.error('Erro:', error.status, error.statusText, error.responseJSON);
        });
}

// Chama a função myHome() quando o documento estiver pronto
$(document).ready(myHome);
