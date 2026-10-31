// data.js
// Avatar Map per Gender
        const avatarMap = {
            femenino: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
            masculino: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80"
        };

        // Doctors Map per Symptom
        const doctorsMap = {
            cabeza: [
                { name: "Dr. Alejandro Silva", spec: "Neurología" },
                { name: "Dra. Sofía Ramírez", spec: "Medicina General" }
            ],
            estomago: [
                { name: "Dr. Roberto Mendoza", spec: "Gastroenterología" },
                { name: "Dra. Sofía Ramírez", spec: "Medicina General" }
            ],
            respiratorio: [
                { name: "Dra. Carmen Ortiz", spec: "Neumología" },
                { name: "Dra. Sofía Ramírez", spec: "Medicina General" }
            ],
            articulaciones: [
                { name: "Dr. Fernando Morales", spec: "Traumatología" },
                { name: "Dra. Sofía Ramírez", spec: "Medicina General" }
            ],
            piel: [
                { name: "Dra. Lucía Méndez", spec: "Dermatología" },
                { name: "Dra. Sofía Ramírez", spec: "Medicina General" }
            ],
            general: [
                { name: "Dra. Sofía Ramírez", spec: "Medicina General" },
                { name: "Dr. Javier López", spec: "Medicina General" }
            ]
        };

        // Default Guest Data State (María González)
        const defaultGuestState = {
            credentials: {
                username: "Guest",
                password: "12345678"
            },
            profile: {
                name: "María González",
                exp: "EXP-9021",
                gender: "femenino",
                email: "maria.gonzalez@email.com",
                phone: "+502 5544-3322",
                dob: "1991-05-14",
                emergencyContact: "Carlos González (Esposo) - 4433-2211",
                blood: "O Rh+",
                bp: "120/80 mmHg",
                hr: "72 lpm",
                allergies: "Penicilina"
            },
            appointments: [
                { id: 101, doctor: "Dra. Sofía Ramírez", spec: "Medicina General", symptom: "Chequeo General", date: "2026-11-05", time: "10:30 AM", room: "Consultorio 204 (Piso 2)", status: "Confirmada" },
                { id: 102, doctor: "Dr. Alejandro Silva", spec: "Cardiología", symptom: "Dolor de Cabeza / Presión", date: "2026-11-12", time: "03:00 PM", room: "Consultorio 410 (Piso 4)", status: "Pendiente" }
            ]
        };

        // Current Active Patient State
        let patientState = {
            isLoggedIn: false,
            credentials: { ...defaultGuestState.credentials },
            profile: { ...defaultGuestState.profile },
            selectedSymptoms: [],
            appointments: [ ...defaultGuestState.appointments ]
        };

        // Local Storage Helper Functions
        const STORAGE_KEY = 'sistema_medico_patient_data';
