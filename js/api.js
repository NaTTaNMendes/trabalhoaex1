async function signup() {
    const name = document.getElementById("signup-name").value
    const email = document.getElementById("signup-email").value
    const password = document.getElementById("signup-password").value

    let userData = {
        name: name,
        email: email,
        password: password
    };

    if (!name) {
        alert("O campo nome não pode ser vazio!");
        return;
    }
    if (!email) {
        alert("O campo email não pode ser vazio!");
        return;
    }
    if (!password) {
        alert("O campo senha não pode ser vazio!");
        return;
    }

    const response = await apiRequest("/api/users/signup", "POST", userData);

    if (response.status == 201) {
        goToPage('login');
    } else {
        alert("Email ja cadastrado! Tente novamente com outro email.");
        return;
    }
}

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    let userData = {
        email: email,
        password: password
    };

    if (!email) {
        alert("O campo email não pode ser vazio!");
        return;
    }
    if (!password) {
        alert("O campo senha não pode ser vazio!");
        return;
    }

    try {
        const response = await apiRequest("/api/users/login", "POST", userData);

        if (response.status == 200) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            goToPage('principal')
        } else {
            console.error("Erro ao fazer login: Dados inválidos.");
        }
    } catch (error) {
        console.error("Erro na requisição de login:", error);
    }
}

async function updateProfile() {

    try {

        let profileData = {
            faceShape: localStorage.getItem("selectHeadType"),
            hairCurl: localStorage.getItem("selectHairType")
        };
    
        const response = await apiRequest("/api/users/profile", "PATCH", profileData, localStorage.getItem("token"));

        if (response.status != 200) {
            console.error("Erro ao enviar os dados do usuário.");
        }
    } catch (error) {
        console.error("Erro na requisição de envio de dados do perfil:", error);
    }
}

async function getPastAppointments() {
    try {
        const response = await apiRequest("/api/appointments/history", "GET", null, localStorage.getItem("token"));
        const data = await response.json();
        const container = document.getElementById("appointment-history");

        for (let i = 0; i < data.length; i++) {
            const row = document.createElement('tr');
            const ap = data[i];

            const parsedTime = parseLocalDateTime(ap.startInterval);

            row.innerHTML = `
                <td>${parsedTime.dateValue}</td>
                <td>${parsedTime.timeValue}</td>
                <td>${ap.beautyItems.map(ap => ap.name).join(', ')}</td>
                <td>${ap.employee.name}</td>
                <td>R$ ${ap.totalPrice}</td>
            `;
            container.appendChild(row);
        }

        if (container.children.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.classList.add('text-center');
            emptyRow.innerHTML = '<td colspan="5">Nenhum histórico de agendamentos disponível.</td>';
            container.appendChild(emptyRow);
        }
            
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
    }
}

async function getNextAppointments() {
    try {
        const response = await apiRequest("/api/appointments", "GET", null, localStorage.getItem("token"));
        const data = await response.json();
        const container = document.getElementById("upcoming-appointments");

        for (let i = 0; i < data.length; i++) {
            const row = document.createElement('tr');
            const ap = data[i];

            const parsedTime = parseLocalDateTime(ap.startInterval);

            if (ap.active) {
                row.innerHTML = `
                <td>${parsedTime.dateValue}</td>
                <td>${parsedTime.timeValue}</td>
                <td>${ap.beautyItems.map(ap => ap.name).join(', ')}</td>
                <td>${ap.employee.name}</td>
                <td>R$ ${ap.totalPrice}</td>
                <td class="text-center">
                    <button class="btn btn-danger " onclick="cancelAppointment(${ap.id})">Cancelar</button>
                </td>
            `;
            container.appendChild(row);
            }
        }

        if (container.children.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.classList.add('text-center');
            emptyRow.innerHTML = '<td colspan="6">Nenhum agendamento disponível.</td>';
            container.appendChild(emptyRow);
        }
            
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
    }
}

async function collectProfile() {

    try {
        const response = await apiRequest("/api/users/profile", "GET", null, localStorage.getItem("token"));

        if (response.status == 200) {
            const data = await response.json();

            const faceShapes = {
                "ROUND": "Redondo",
                "SQUARE": "Quadrado",
                "TRIANGLE": "Triangular",
                "OVAL": "Oval",
                "DIAMOND": "Diamante"
            };

            const hairCurls = {
                "STRAIGHT": "Liso",
                "WAVY": "Ondulado",
                "CURLY": "Cacheado",
                "KINKY": "Crespo"
            };

            if (data.faceShape != null) {
                document.getElementById("faceShape").innerHTML = faceShapes[data.faceShape];
            } else {
                document.getElementById("faceShape").innerHTML = "Nenhum";
            }

            if (data.hairCurl != null) {
                document.getElementById("hairType").innerHTML = hairCurls[data.hairCurl];
            } else {
                document.getElementById("hairType").innerHTML = "Nenhum";
            }

            if (data.name != null) {
                document.getElementById("userName").innerHTML = data.name;
            }

            if (data.favoriteEmployeeName != null) {
                document.getElementById("favoriteProfessional").innerHTML = data.favoriteEmployeeName;
            } else {
                document.getElementById("favoriteProfessional").innerHTML = "Nenhum";
            }

            if (data.loyaltyPoints != null) {
                document.getElementById("points").innerHTML = data.loyaltyPoints;
            } else {
                document.getElementById("points").innerHTML = "Nenhum";
            }

        } else {
            console.error("Erro ao coletar dados do usuário.");
        }
    } catch (error) {
        console.error("Erro na requisição coleta de dados do usuário:", error);
    }
}

async function cancelAppointment(id) {
    await apiRequest(`/api/appointments/cancel/${id}`, "PATCH", null, localStorage.getItem("token"));
    location.reload();
}

async function getEmployees() {
    const container = document.getElementById("professionalSelect");
    const response = await apiRequest("/api/users/employees", "GET")

    const data = await response.json();

    let employeeList = "";

    data.forEach(emp => {
        employeeList += `<option id="${emp.id}">${emp.name}</option>`
    });

    container.innerHTML = employeeList
}

async function getBeautyItems() {
    const response = await apiRequest("/api/beauty-items", "GET")
    const data = await response.json();
    const container = document.getElementById("service-list");

    let beautyItems = "";

    data.forEach(bi => {
        beautyItems += `<div class="col-md-4 mb-3">
                            <div class="card-servico" id="${bi.id}" onclick="toggleCard(this.id)"><h5>${bi.name}</h5></div>
                        </div>`
    });

    container.innerHTML = beautyItems;
}

async function scheduleAppointment() {
    const appointmentData = getAppointmentData();

    console.log(appointmentData);

    const response = await apiRequest("/api/appointments", "POST", appointmentData, localStorage.getItem("token"))

    console.log(response.status)

    if (response.status === 201) {
        goToPage("principal");
    }
}

async function updateUserName(name) {
    if (name.length == 0) {
        alert("O nome não pode ser vazio!");
    } else {
        let response = await apiRequest("/api/users/profile", "PATCH", {name: name}, localStorage.getItem("token"));
        response = await response.json();

        if (response) {
            goToPage("principal");
        }
    }
}