function deslogar() {
    window.location.href = 'login.html';
}

function goToAgendar() {
    window.location.href = 'agendar.html'; 
}

function goToAgendamentos() {
    window.location.href = 'agendamentos.html'; 
}

// Carregar o conteúdo da navbar
fetch('navbar.html')
.then(response => response.text())
.then(data => {
    document.getElementById('navbar').innerHTML = data;
})
.catch(error => console.error('Erro ao carregar a navbar:', error));