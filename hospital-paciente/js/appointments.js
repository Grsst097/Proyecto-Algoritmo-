// appointments.js
// Render Appointments
        function renderAppointments() {
            const container = document.getElementById('appointments-patient-list');
            if (!container) return;

            if (patientState.appointments.length === 0) {
                container.innerHTML = `
                    <div class="bg-white p-8 rounded-3xl border border-slate-100 text-center space-y-3">
                        <i class="fa-solid fa-calendar-xmark text-4xl text-slate-300"></i>
                        <p class="text-slate-500 font-medium text-sm">No tienes citas médicas programadas actualmente.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = patientState.appointments.map(app => `
                <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-patient-500/30">
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 rounded-2xl bg-patient-50 text-patient-600 flex items-center justify-center text-xl shrink-0 mt-1 sm:mt-0">
                            <i class="fa-solid fa-stethoscope"></i>
                        </div>
                        <div class="space-y-1">
                            <div class="flex items-center gap-2 flex-wrap">
                                <h4 class="font-bold text-slate-800 text-base">${app.doctor}</h4>
                                <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full ${app.status === 'Confirmada' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}">${app.status}</span>
                            </div>
                            <p class="text-xs text-patient-700 font-semibold">${app.spec} • <span class="text-slate-500 font-normal">Motivo: ${app.symptom}</span></p>
                            <p class="text-xs text-slate-400 flex items-center gap-3 pt-1">
                                <span><i class="fa-regular fa-calendar mr-1"></i>${app.date}</span>
                                <span><i class="fa-regular fa-clock mr-1"></i>${app.time}</span>
                                <span><i class="fa-solid fa-location-dot mr-1 text-slate-400"></i>${app.room}</span>
                            </p>
                        </div>
                    </div>
                    <button onclick="cancelAppointment(${app.id})" class="text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl text-xs font-semibold transition-all self-end sm:self-center">
                        <i class="fa-solid fa-calendar-xmark mr-1"></i> Cancelar Cita
                    </button>
                </div>
            `).join('');
        }

        function cancelAppointment(id) {
            patientState.appointments = patientState.appointments.filter(a => a.id !== id);
            saveToLocalStorage();
            renderAppointments();
            showToast("Cita cancelada correctamente", "info");
        }

        // Doctors update logic according to selected symptom
        function updateDoctorsBySymptom() {
            const symptomVal = document.getElementById('appointment-symptom').value;
            const doctorSelect = document.getElementById('appointment-doctor');
            const availableDoctors = doctorsMap[symptomVal] || doctorsMap.general;

            doctorSelect.innerHTML = availableDoctors.map(d => `
                <option value="${d.name} (${d.spec})">${d.name} - ${d.spec}</option>
            `).join('');
        }

        // Appointment Modal
        function openNewAppointmentModal() {
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('appointment-date').value = today;
            updateDoctorsBySymptom();
            document.getElementById('modal-appointment').classList.remove('hidden');
        }

        function closeAppointmentModal() {
            document.getElementById('modal-appointment').classList.add('hidden');
        }

        function handleBookAppointment(e) {
            e.preventDefault();
            const symptomSelect = document.getElementById('appointment-symptom');
            const symptomText = symptomSelect.options[symptomSelect.selectedIndex].text;
            const doctorVal = document.getElementById('appointment-doctor').value;
            const dateVal = document.getElementById('appointment-date').value;
            const timeVal = document.getElementById('appointment-time').value;

            const newApp = {
                id: Date.now(),
                doctor: doctorVal.split('(')[0].trim(),
                spec: doctorVal.includes('(') ? doctorVal.split('(')[1].replace(')', '') : 'Medicina General',
                symptom: symptomText,
                date: dateVal,
                time: timeVal,
                room: "Consultorio Externa (Piso 2)",
                status: "Confirmada"
            };

            patientState.appointments.unshift(newApp);
            saveToLocalStorage();
            renderAppointments();
            closeAppointmentModal();
            switchTab('citas');
            showToast("Cita presencial agendada exitosamente", "success");
        }
