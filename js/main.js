async function listBeautyItemsInSchedulingPage() {
    insertBeautyItemInSchedulingPage(await getBeautyItems());
}

async function listEmployeesInSchedulingPage() {
    populateSelectEmployee(await getEmployees());
}

async function listEmployees() {
    insertEmployees(await getEmployees());
}

async function listBeautyItems() {
    insertBeautyItemData(await getBeautyItems());
}

async function listAppointmentHistory() {
    populateAppointmentsHistory(await getAppointmentHistory());
}

async function listNextAppointments() {
    populateNextAppointments(await getNextAppointments());
}

async function cancelAppointmentById(id) {
    if (confirm("Tem certeza que deseja cancelar este agendamento?")) {

        console.log(await cancelAppointment(id));

        let row = button.parentNode.parentNode;
        row.parentNode.removeChild(row);
        alert("Agendamento cancelado com sucesso!")
    }
}

function cancelarAgendamento(button) {
    if (confirm("Tem certeza que deseja cancelar este agendamento?")) {
        // Lógica para cancelar o agendamento, exemplo: remoção da linha
        let row = button.parentNode.parentNode;
        row.parentNode.removeChild(row);
        alert("Agendamento cancelado com sucesso.");
    }
}