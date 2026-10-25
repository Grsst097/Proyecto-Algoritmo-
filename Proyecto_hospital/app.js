document.addEventListener("DOMContentLoaded", () => {
  // Opciones de atención enfocadas en necesidades del usuario
  const doctorsData = {
    general: [{ name: "Dra. Andrea Morales", spec: "Medicina General y Preventiva", code: "AM" }, { name: "Dr. Carlos Méndez", spec: "Medicina Interna", code: "CM" }],
    cardio: [{ name: "Dr. Roberto Castillo", spec: "Especialista en Salud Cardiovascular", code: "RC" }],
    derma: [{ name: "Dra. Valeria López", spec: "Especialista en Cuidado de la Piel", code: "VL" }],
    pedia: [{ name: "Dra. Lucía Fernández", spec: "Especialista en Salud Infantil", code: "LF" }],
    gino: [{ name: "Dra. Gabriela Torres", spec: "Especialista en Salud de la Mujer", code: "GT" }],
    trauma: [{ name: "Dr. Javier Ramírez", spec: "Especialista en Huesos y Articulaciones", code: "JR" }],
    gastro: [{ name: "Dr. Fernando Díaz", spec: "Especialista en Aparato Digestivo", code: "FD" }]
  };

  // Directorio traducido a lenguaje cotidiano
  const specialtiesList = [
    { icon: "🩺", title: "Chequeo general o malestar común", desc: "Ideal para revisiones de rutina, dolores leves o síntomas generales.", key: "general" },
    { icon: "🫀", title: "Salud del corazón", desc: "Revisiones preventivas, control de presión y salud cardiovascular.", key: "cardio" },
    { icon: "🩺", title: "Cuidado de la piel", desc: "Atención para manchas, alergias, lunares y problemas dermatológicos.", key: "derma" },
    { icon: "👶", title: "Atención para niños", desc: "Seguimiento del crecimiento, desarrollo y salud general infantil.", key: "pedia" },
    { icon: "⚕️", title: "Salud de la mujer", desc: "Revisiones periódicas y asesoría especializada integral.", key: "gino" },
    { icon: "🦴", title: "Huesos, articulaciones y músculos", desc: "Apoyo para dolores de espalda, extremidades o lesiones deportivas.", key: "trauma" }
  ];

  let appointments = [];
  let selectedDoctor = null;
  let selectedSlot = null;

  const $ = id => document.getElementById(id);

  function showToast(msg) {
    const t = $('toast');
    if (!t) return;
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(() => { t.style.display = 'none'; }, 3000);
  }

  function showReport(title, content) {
    $('modalTitle').textContent = title;
    $('modalBody').textContent = content;
    $('modal').classList.add('show');
  }

  function closeModal() {
    $('modal').classList.remove('show');
  }

  if ($('btnCloseModal')) {
    $('btnCloseModal').addEventListener('click', closeModal);
  }

  document.querySelectorAll('.btn-report').forEach(btn => {
    btn.addEventListener('click', () => {
      showReport(btn.dataset.title, btn.dataset.content);
    });
  });

  function navigateTo(pageId) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === pageId);
    });
    
    const target = $('page-' + pageId);
    if (target) target.classList.add('active');

    if (pageId === 'citas') renderAppointmentsTable();
    if (pageId === 'inicio') updateHomeDashboard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.addEventListener('click', (e) => {
    const btnPage = e.target.closest('[data-page]');
    if (btnPage) {
      navigateTo(btnPage.dataset.page);
      return;
    }

    const btnGoto = e.target.closest('[data-goto]');
    if (btnGoto) {
      navigateTo(btnGoto.dataset.goto);
      return;
    }

    const btnCancel = e.target.closest('[data-cancel-id]');
    if (btnCancel) {
      cancelAppointment(btnCancel.dataset.cancelId);
      return;
    }
  });

  function showBookingStep(step) {
    [1, 2, 3, 4].forEach(i => {
      const stepElem = $('bookingStep' + i);
      const indicator = $('step' + i);
      if (stepElem) stepElem.style.display = (i === step) ? 'block' : 'none';
      if (indicator) indicator.classList.toggle('active', i <= step);
    });
  }

  if ($('btnToStep2')) {
    $('btnToStep2').addEventListener('click', () => {
      const specKey = $('selectSpecialty').value;
      if (!specKey) {
        showToast('Selecciona un motivo de consulta para continuar');
        return;
      }
      renderDoctorsList(specKey);
      showBookingStep(2);
    });
  }

  function renderDoctorsList(specKey) {
    const container = $('doctorsContainer');
    container.innerHTML = '';
    const docs = doctorsData[specKey] || [];
    
    docs.forEach(doc => {
      const div = document.createElement('div');
      div.className = 'doc-item';
      div.innerHTML = `
        <div class="doc-avatar">${doc.code}</div>
        <div>
          <strong style="display:block; color:var(--primary); font-size:14px;">${doc.name}</strong>
          <span style="font-size:12px; color:var(--text-muted);">${doc.spec}</span>
        </div>
      `;
      div.addEventListener('click', () => {
        document.querySelectorAll('.doc-item').forEach(d => d.classList.remove('selected'));
        div.classList.add('selected');
        selectedDoctor = doc;
        $('btnToStep3').disabled = false;
      });
      container.appendChild(div);
    });
  }

  if ($('btnBackToStep1')) $('btnBackToStep1').addEventListener('click', () => showBookingStep(1));

  if ($('btnToStep3')) {
    $('btnToStep3').addEventListener('click', () => {
      showBookingStep(3);
      
      // CONFIGURACIÓN DE FECHA MÍNIMA (A partir de mañana)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const minDate = tomorrow.toISOString().split('T')[0];
      
      $('appointmentDate').min = minDate;
      $('appointmentDate').value = minDate; // Selecciona por defecto el día de mañana
      renderSlots();
    });
  }

  if ($('appointmentDate')) $('appointmentDate').addEventListener('change', renderSlots);

  function renderSlots() {
    const container = $('slotsContainer');
    container.innerHTML = '';
    const hours = ["08:00 AM", "09:00 AM", "10:30 AM", "11:15 AM", "02:00 PM", "03:30 PM", "04:15 PM"];
    
    hours.forEach(hr => {
      const btn = document.createElement('button');
      btn.className = 'slot-btn';
      btn.textContent = hr;
      btn.type = 'button';
      btn.addEventListener('click', () => {
        document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedSlot = hr;
        $('btnToStep4').disabled = false;
      });
      container.appendChild(btn);
    });
  }

  if ($('btnBackToStep2')) $('btnBackToStep2').addEventListener('click', () => showBookingStep(2));

  if ($('btnToStep4')) {
    $('btnToStep4').addEventListener('click', () => {
      showBookingStep(4);
      const dateVal = $('appointmentDate').value;
      $('summaryNotice').innerHTML = `
        <strong>Resumen de tu Visita:</strong><br>
        • Profesional: ${selectedDoctor.name} (${selectedDoctor.spec})<br>
        • Fecha y Hora: ${dateVal} a las ${selectedSlot}
      `;
    });
  }

  if ($('btnBackToStep3')) $('btnBackToStep3').addEventListener('click', () => showBookingStep(3));

  if ($('btnFinalizeBooking')) {
    $('btnFinalizeBooking').addEventListener('click', () => {
      const newApp = {
        id: 'CIT-' + Math.floor(1000 + Math.random() * 9000),
        doctor: selectedDoctor.name,
        spec: selectedDoctor.spec,
        date: $('appointmentDate').value,
        time: selectedSlot,
        status: 'Confirmada'
      };
      
      appointments.push(newApp);
      saveData();
      showToast('¡Cita programada con éxito!');
      showBookingStep(1);
      $('selectSpecialty').value = '';
      if ($('bookingNotes')) $('bookingNotes').value = '';
      navigateTo('citas');
    });
  }

  function saveData() {
    localStorage.setItem('med_portal_appointments', JSON.stringify(appointments));
    updateHomeDashboard();
  }

  function loadData() {
    const stored = localStorage.getItem('med_portal_appointments');
    if (stored) {
      try { appointments = JSON.parse(stored); } catch(e) { appointments = []; }
    }
  }

  function renderAppointmentsTable() {
    const tbody = document.querySelector('#appointmentsTable tbody');
    if (!tbody) return;
    const filter = $('filterStatus') ? $('filterStatus').value : 'all';
    tbody.innerHTML = '';
    
    const filtered = appointments.filter(a => filter === 'all' || a.status === filter);
    
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:24px;">No se encontraron registros de citas.</td></tr>`;
      return;
    }
    
    filtered.forEach(a => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${a.id}</strong></td>
        <td>${a.doctor}<br><small style="color:var(--text-muted);">${a.spec}</small></td>
        <td>${a.date}<br><small style="color:var(--text-muted);">${a.time}</small></td>
        <td><span class="status ${a.status === 'Confirmada' ? 'status-confirmed' : 'status-cancelled'}">${a.status}</span></td>
        <td>
          ${a.status === 'Confirmada' ? `<button class="btn btn-danger btn-sm" data-cancel-id="${a.id}">Cancelar</button>` : '-'}
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function cancelAppointment(id) {
    const item = appointments.find(x => x.id === id);
    if (item) {
      item.status = 'Cancelada';
      saveData();
      renderAppointmentsTable();
      showToast('La cita ha sido cancelada');
    }
  }

  if ($('filterStatus')) $('filterStatus').addEventListener('change', renderAppointmentsTable);

  function updateHomeDashboard() {
    const activeCount = appointments.filter(a => a.status === 'Confirmada').length;
    if ($('statUpcoming')) $('statUpcoming').textContent = activeCount;
    if ($('navBadge')) $('navBadge').textContent = activeCount;

    const container = $('homeNextAppointment');
    if (!container) return;
    const activeApps = appointments.filter(a => a.status === 'Confirmada');

    if (activeApps.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:20px; color:var(--text-muted);">
          <p style="margin:0 0 12px 0;">No tienes consultas programadas próximamente.</p>
          <button class="btn btn-primary btn-sm" data-goto="agendar">Agendar Cita Ahora</button>
        </div>
      `;
    } else {
      const next = activeApps[0];
      container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong style="color:var(--primary); font-size:15px; display:block;">${next.doctor}</strong>
            <span style="font-size:12px; color:var(--text-muted);">${next.spec}</span>
            <p style="margin:6px 0 0; font-size:13px;">📅 ${next.date} a las ${next.time}</p>
          </div>
          <span class="status status-confirmed">${next.status}</span>
        </div>
      `;
    }
  }

  function renderSpecialties() {
    const grid = $('specialtyList');
    if (!grid) return;
    grid.innerHTML = '';
    specialtiesList.forEach(s => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.marginBottom = '0';
      card.innerHTML = `
        <div style="font-size:28px; margin-bottom:8px;">${s.icon}</div>
        <h4 style="margin:0 0 6px; color:var(--primary);">${s.title}</h4>
        <p style="font-size:12px; color:var(--text-muted); margin:0 0 14px;">${s.desc}</p>
        <button class="btn btn-outline btn-sm" style="width:100%;">Seleccionar este motivo</button>
      `;
      card.querySelector('button').addEventListener('click', () => {
        navigateTo('agendar');
        if ($('selectSpecialty')) $('selectSpecialty').value = s.key;
      });
      grid.appendChild(card);
    });
  }

  if ($('currentDate')) {
    $('currentDate').textContent = new Date().toLocaleDateString('es-GT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
  loadData();
  renderSpecialties();
  updateHomeDashboard();
});