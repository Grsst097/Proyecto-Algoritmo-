// storage.js
function saveToLocalStorage() {
            try {
                const dataToSave = {
                    credentials: patientState.credentials,
                    profile: patientState.profile,
                    appointments: patientState.appointments
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
            } catch (err) {
                console.error("Error guardando datos locales:", err);
            }
        }

        function loadFromLocalStorage() {
            try {
                const savedData = localStorage.getItem(STORAGE_KEY);
                if (savedData) {
                    const parsed = JSON.parse(savedData);
                    if (parsed.credentials) patientState.credentials = parsed.credentials;
                    if (parsed.profile) patientState.profile = parsed.profile;
                    if (parsed.appointments) patientState.appointments = parsed.appointments;
                } else {
                    // Default to Guest / María González if no saved data exists
                    patientState.credentials = JSON.parse(JSON.stringify(defaultGuestState.credentials));
                    patientState.profile = JSON.parse(JSON.stringify(defaultGuestState.profile));
                    patientState.appointments = JSON.parse(JSON.stringify(defaultGuestState.appointments));
                }
            } catch (err) {
                console.error("Error cargando datos locales:", err);
            }
        }
