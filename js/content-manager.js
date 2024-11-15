function insertUserProfile(data) {
  const name = document.getElementById("userName");
  const hairCurl = document.getElementById("hairType");
  const faceShape = document.getElementById("faceShape");

  if (data.hairCurl == null) { data.hairCurl = "Indefinido" }
  if (data.faceShape == null) { data.faceShape = "Indefinido" }

  name.innerHTML = data.name;
  hairCurl.innerHTML = data.hairCurl;
  faceShape.innerHTML = data.faceShape;
}

function createBeautyItemCard(item) {
  return `
      <div class="col-md-4">
          <div class="service-card">
              <img src="images/corte-feminino.jpeg" alt="${item.name}">
              <h3>${item.name}</h3>
              <p class="service-price">R$ ${ensureDecimal(item.price)}</p>
              <p class="service-description">${item.description}</p>
              <p class="service-duration"><i class="ph ph-clock"></i> ${item.duration} minutos</p>
              <button class="btn btn-dark btn-schedule" onclick="goTo('AGENDAR')">Agendar</button>
          </div>
      </div>`;
}

function insertBeautyItemData(data) {
  const beautyItemsContainer = document.getElementById("beauty-items");

  const allItemsHTML = data.map(createBeautyItemCard).join("");

  beautyItemsContainer.innerHTML = allItemsHTML;
}

function createSchedulingBeautyItem(data) {
  return `
    <div class="col-md-4 mb-3">
      <div class="card-servico" id="${normalize(data.name)}" data-beit-id="${data.id}" onclick="toggleCard(this.id)"><h5>${data.name}</h5></div>
    </div>
  `
}

function insertBeautyItemInSchedulingPage(data) {
  const container = document.getElementById("beauty-item-list");

  const allBeautyItems = data.map(createSchedulingBeautyItem).join("");

  container.innerHTML = allBeautyItems;
}

function createEmployeeOption(employee) {
  return `<option data-employee-id="${employee.id}">${employee.name}</option>`;
}

function populateSelectEmployee(data) {
  const select = document.getElementById("professionalSelect");
  const allEmployees = data.map(createEmployeeOption).join("");

  select.innerHTML = allEmployees;
}

function createEmployeeCard(employee) {
  return `
  <div class="col-md-4">
    <div class="professional-card">
      <img src="images/cabelereira-1.jpeg" alt="Foto do profissional" class="professional-img">
      <h3>${employee.name}</h3>
      <p>${employee.about}</p>
      <div class="social-icons">
          <i class="ph ph-instagram-logo"></i><a href="#">${employee.instagram}</a>
      </div>
      <div id="carousel1" class="carousel slide" data-ride="carousel">
          <div class="carousel-inner">
              <div class="carousel-item active">
                  <img src="images/cab1-fot1.jpeg" class="d-block w-100" alt="Trabalho 1">
              </div>
              <div class="carousel-item">
                  <img src="images/cab1-fot2.jpeg" class="d-block w-100" alt="Trabalho 2">
              </div>
              <div class="carousel-item">
                  <img src="images/cab1-fot3.jpeg" class="d-block w-100" alt="Trabalho 3">
              </div>
          </div>
          <a class="carousel-control-prev" href="#carousel1" role="button" data-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
          </a>
          <a class="carousel-control-next" href="#carousel1" role="button" data-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="sr-only">Next</span>
          </a>
      </div>
      <button class="btn btn-dark btn-schedule" onclick="goTo('AGENDAR')">Marcar Horário</button>
    </div>
  </div>
  `
}

function insertEmployees(data) {
  const select = document.getElementById("employee-list");
  const allEmployees = data.map(createEmployeeCard).join("");

  select.innerHTML = allEmployees;
}

function populateAppointmentsHistory(data) {
  const container = document.getElementById("appointment-history");

  data.forEach((appointment) => {
      const row = document.createElement('tr');

      const parsed = parseLocalDateTime(appointment.startInterval);

      row.innerHTML = `
          <td>${parsed.timeValue}</td>
          <td>${parsed.dateValue}</td>
          <td>${appointment.beautyItems.map(ap => ap.name).join(', ')}</td>
          <td>${appointment.employee.name}</td>
      `;
      container.appendChild(row);
  });

  if (container.children.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.classList.add('text-center');
      emptyRow.innerHTML = '<td colspan="4">Nenhum histórico de agendamentos disponível.</td>';
      container.appendChild(emptyRow);
  }
}

function populateNextAppointments(data) {
  const container = document.getElementById("next-appointments");

  data.forEach((appointment) => {

    const card = document.createElement('tr');
    card.id = appointment.id;

    const parsed = parseLocalDateTime(appointment.startInterval);

    const cardContent = `
            <td>${parsed.timeValue}</td>
            <td>${parsed.dateValue}</td>
            <td>${appointment.beautyItems.map(ap => ap.name).join(', ')}</td>
            <td>${appointment.employee.name}</td>
            <td>${appointment.active ? "ativo" : "inativo"}</td>
            <td>
                <button class="btn cancel-btn btn-sm" onclick="cancelAppointment(${appointment.id})">Cancelar</button>
            </td>
    `;

    card.innerHTML = cardContent;
    container.appendChild(card);
  });

  if (container.children.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.classList.add('text-center');
      emptyRow.innerHTML = '<td colspan="5">Nenhum agendamento disponível.</td>';
      container.appendChild(emptyRow);
      return;
  }
}