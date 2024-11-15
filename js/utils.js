const BASE_URL = "https://beauty-salon-scheduler.onrender.com";

const LOCATIONS = {
    AGENDAR: "/sistema/agendar.html",
    AGENDAMENTOS: "/sistema/agendamentos.html",
    PRINCIPAL: "/sistema/principal.html",
    HISTORICO: "/sistema/historico.html",
    LOGIN: "/sistema/login.html",
    CADASTRO: "/sistema/cadastro.html",
    PROFISSIONAIS: "/profissionais.html",
    SERVICOS: "/servicos.html",
    INDEX: "/index.html"
};

function goTo(location) {
    const currentPath = window.location.pathname;
    
    let destination = LOCATIONS[location] || location;

    const isInsideSistema = currentPath.startsWith('/sistema');
    const isDestinationSistema = destination.startsWith('/sistema');

    if (isDestinationSistema && !isInsideSistema) {
        window.location.href = destination;
    } else if (isDestinationSistema && isInsideSistema) {
        window.location.href = destination;
    } else {
        window.location.href = destination;
    }
}

async function apiRequest(endpoint, method = 'GET', body = null, token = null) {
    let headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method: method,
        headers: headers
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);

        if (response.status >= 400) {
            if (response.status === 403) {
                localStorage.removeItem("token");
                goTo('LOGIN');
            }
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        let data;

        try {
            data = await response.json();
        } catch (error) {
            data = true;
        }

        return data;
    } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
        throw error;
    }
}

function verifyAuth() {
    const allPermitedLocations = [LOCATIONS.LOGIN, LOCATIONS.CADASTRO, LOCATIONS.PROFISSIONAIS, LOCATIONS.SERVICOS, LOCATIONS.INDEX];
    const valid = isTokenValid()

    console.log(isTokenValid())

    if (valid != true && !allPermitedLocations.includes(window.location.pathname)) {
        goTo("LOGIN");
    }
}

function isTokenValid() {
    const token = localStorage.getItem("token");

    if (!token) {
        return false;
    }

    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        const expiry = payload.exp * 1000;
        return expiry > Date.now();
    }
}

function logout() {
    localStorage.removeItem("token");
    goTo(LOCATIONS.LOGIN);
}

function ensureDecimal(number) {
    const parsedNumber = parseFloat(number);
  
    if (isNaN(parsedNumber)) {
        throw new Error("O valor fornecido não é um número válido.");
    }
  
    return parsedNumber.toFixed(2);
}

function normalize(name) {
    return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ç/g, "c")
        .replace(/\s+/g, "_")
        .toLowerCase();
}

function getLocalDateTime(dateValue, timeValue) {
    const [year, month, day] = dateValue.split('-');
    const [hours, minutes] = timeValue.split(':');

    const dateTime = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
    
    return dateTime.toISOString().slice(0, 19);
}

function parseLocalDateTime(localDateTime) {
    const [date, time] = localDateTime.split('T');
    const [year, month, day] = date.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    const [hours, minutes] = time.split(':');
    const formattedTime = `${hours}:${minutes}`;

    return {
        dateValue: formattedDate,
        timeValue: formattedTime
    };
}



// document.addEventListener("DOMContentLoaded", () => {
//     // Carregar o conteúdo da navbar
//     fetch('../sistema/navbar.html')
//     .then(response => response.text())
//     .then(data => {
//         let navbar = document.querySelector('.navbar')
//         navbar.innerHTML = data
//         //  = data
//     })
//     .catch(error => console.error('Erro ao carregar a navbar:', error));
// })