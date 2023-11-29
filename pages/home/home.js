function myHome() {
    changeTitle();
    console.log('home funciona');

    // Obtém todos os 'item'.
    getAll('/items', '#tableItem');

    // Obtém todos os 'owner'.
    getAll('/owner', '#tableOwner');

}

function getAll(endPoint, tableId) {

    // Acessa o endpoint da API.
    $.get(app.apiBaseURL + endPoint)

        // Se deu certo.
        .done((apiData) => {
            console.log("Dados:", apiData);
        })

        // Se falhou.
        .fail((error) => {
            console.error("Oooops! ", error)
        })

    return false;
}

$(document).ready(myHome);