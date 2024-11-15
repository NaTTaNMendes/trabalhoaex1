async function signup() {
    const name = document.getElementById("signup-name").value
    const email = document.getElementById("signup-email").value
    const password = document.getElementById("signup-password").value
    const passwordConfirmation = document.getElementById("signup-password-confirmation").value

    if (!password === passwordConfirmation) {
        alert("As senhas informadas diferem!")
    }

    let userData = {
        name: name,
        email: email,
        password: password
    };

    const response = await apiRequest("/api/users/signup", "POST", userData);

    if (response) {
        goTo('LOGIN');
    }
}

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    let userData = {
        email: email,
        password: password
    };

    try {
        const data = await apiRequest("/api/users/login", "POST", userData);

        if (data) {
            localStorage.setItem("token", data.token);
            goTo('PRINCIPAL');
        } else {
            console.error("Erro ao fazer login: Dados inválidos.");
        }
    } catch (error) {
        console.error("Erro na requisição de login:", error);
    }
}


async function getUserProfile() {
    const response = await apiRequest("/api/users/profile", "GET", null, localStorage.getItem("token"));
    
    insertUserProfile(response)
}

async function updateProfile() {
}


function getBeautyItems() {
    return apiRequest("/api/beauty-items", "GET");
}

async function getEmployees() {
    return apiRequest("/api/users/employees", "GET");
}


async function scheduleAppointment(appointmentData) {
    return apiRequest("/api/appointments", "POST", appointmentData, localStorage.getItem("token"));
}

async function cancelAppointment(id) {
    const response = await apiRequest(`/api/appointments/cancel/${id}`, "PATCH", null, localStorage.getItem("token"));

    if (response.success) {
        console.log("resetou!")
    }
}

async function rescheduleAppointment() {
    // /api/users/profile POST body token
    // body:
    //{
    //     "newDate": "2025-02-10T13:00:00"
    // }
}


async function getAppointmentHistory() {
    return apiRequest("/api/appointments/history", "GET", null, localStorage.getItem("token"));
}

async function getNextAppointments() {
    return apiRequest("/api/appointments", "GET", null, localStorage.getItem("token"));
}
