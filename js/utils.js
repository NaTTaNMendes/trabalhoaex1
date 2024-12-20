const BASE_URL = "https://beauty-salon-scheduler.onrender.com";

function goToPage(page) {
    if (window.location.href.includes('sistema/')) {
        window.location.href = `${page}.html`; 
    } else {
        window.location.href = `sistema/${page}.html`;
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

        if (response.status === 403) {
            localStorage.removeItem("token");
            goToPage('login');
        }
            
        return response
    } catch (error) {
        console.error('Erro ao fazer a requisição:', error);
        throw error;
    }
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
    const [hours, minutes, seconds] = time.split(':');
    const hoursInUTC3 = parseInt(hours) - 3;
    const formattedTime = `${hoursInUTC3 < 10 ? '0' + hoursInUTC3 : hoursInUTC3}:${minutes}`;

    return {
        dateValue: formattedDate,
        timeValue: formattedTime
    };
}

function ensureDecimal(number) {
    const parsedNumber = parseFloat(number);
  
    if (isNaN(parsedNumber)) {
        throw new Error("O valor fornecido não é um número válido.");
    }
  
    return parsedNumber.toFixed(2);
}

function logout() {
    localStorage.removeItem("token");
    goToPage("login")
}

fetch('navbar.html')
.then(response => response.text())
.then(data => {
    document.getElementById('navbar').innerHTML = data;
})
.catch(error => console.error('Erro ao carregar a navbar:', error));

