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
        goToLogin();
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

async function collectProfile() {

    try {
        const response = await apiRequest("/api/users/profile", "GET", null, localStorage.getItem("token"));

        if (response.status == 200) {
            const data = await response.json();
            
            if (data.faceShape != null) {
                document.getElementById("faceShape").innerHTML = data.faceShape;
            } else {
                document.getElementById("faceShape").innerHTML = "Nenhum";
            }

            if (data.hairCurl != null) {
                document.getElementById("hairType").innerHTML = data.hairCurl;
            } else {
                document.getElementById("hairType").innerHTML = "Nenhum";
            }

            if (data.name != null) {
                document.getElementById("userName").innerHTML = data.name;
            }

        } else {
            console.error("Erro ao coletar dados do usuário.");
        }
    } catch (error) {
        console.error("Erro na requisição coleta de dados do usuário:", error);
    }
}