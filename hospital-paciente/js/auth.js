// auth.js
// Toggle Login / Register Views
        function showRegisterForm() {
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('register-form').classList.remove('hidden');
        }

        function showLoginForm() {
            document.getElementById('register-form').classList.add('hidden');
            document.getElementById('login-form').classList.remove('hidden');
        }

        function handleRegister(e) {
            e.preventDefault();
            const newUsername = document.getElementById('reg-username').value.trim();
            const newPassword = document.getElementById('reg-password').value.trim();
            const newPhoneInput = document.getElementById('reg-phone').value.trim();

            const phoneDigitsRegex = /^[2-7][0-9]{3}[-\s]?[0-9]{4}$/;
            if (!phoneDigitsRegex.test(newPhoneInput)) {
                showToast("Por favor ingresa un número de teléfono válido de 8 dígitos", "warning");
                return;
            }

            if (newPassword.length < 4) {
                showToast("La contraseña debe tener al menos 4 caracteres", "warning");
                return;
            }

            // Generate a new clean empty account
            const randomExpNum = Math.floor(1000 + Math.random() * 9000);
            patientState.credentials.username = newUsername;
            patientState.credentials.password = newPassword;

            patientState.profile = {
                name: "",
                exp: `EXP-${randomExpNum}`,
                gender: "femenino",
                email: "",
                phone: `+502 ${newPhoneInput}`,
                dob: "",
                emergencyContact: "",
                blood: "Sin Registrar",
                bp: "--/-- mmHg",
                hr: "-- lpm",
                allergies: "Sin Alergias Registradas"
            };

            patientState.appointments = [];

            // Automatically log in to the newly created account & persist
            patientState.isLoggedIn = true;
            saveToLocalStorage();
            populateProfileForm();
            renderAppointments();

            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('app-wrapper').classList.remove('hidden');

            switchTab('perfil');
            showToast("Cuenta creada exitosamente. Completa tus datos de perfil.", "success");
        }

        // Handle Login
        function handleLogin(e) {
            e.preventDefault();
            const user = document.getElementById('login-username').value.trim();
            const pass = document.getElementById('login-password').value.trim();

            // Check if attempting Guest login
            const isGuestMatch = (user === defaultGuestState.credentials.username && pass === defaultGuestState.credentials.password);
            const isStoredMatch = (user === patientState.credentials.username && pass === patientState.credentials.password);

            if (isGuestMatch || isStoredMatch) {
                // If logging in as Guest explicitly, load default guest state
                if (isGuestMatch && user !== patientState.credentials.username) {
                    patientState.credentials = JSON.parse(JSON.stringify(defaultGuestState.credentials));
                    patientState.profile = JSON.parse(JSON.stringify(defaultGuestState.profile));
                    patientState.appointments = JSON.parse(JSON.stringify(defaultGuestState.appointments));
                    saveToLocalStorage();
                    populateProfileForm();
                    renderAppointments();
                }

                patientState.isLoggedIn = true;
                document.getElementById('login-screen').classList.add('hidden');
                document.getElementById('app-wrapper').classList.remove('hidden');
                showToast(`¡Bienvenido(a) de nuevo, ${patientState.profile.name || 'Paciente'}!`, "success");
            } else {
                showToast("Usuario o contraseña incorrectos", "warning");
            }
        }

        // Forgot & Reset Password Handlers
        function openForgotPasswordModal() {
            document.getElementById('forgot-step-1').reset();
            document.getElementById('forgot-step-2').reset();
            document.getElementById('forgot-step-1').classList.remove('hidden');
            document.getElementById('forgot-step-2').classList.add('hidden');
            document.getElementById('modal-forgot-password').classList.remove('hidden');
        }

        function closeForgotPasswordModal() {
            document.getElementById('modal-forgot-password').classList.add('hidden');
        }

        function handleVerifyResetIdentity(e) {
            e.preventDefault();
            const userVal = document.getElementById('reset-username').value.trim();
            const phoneVal = document.getElementById('reset-phone').value.trim();

            // Format phone numbers to compare digits
            const storedPhoneClean = patientState.profile.phone.replace(/\D/g, '');
            const enteredPhoneClean = phoneVal.replace(/\D/g, '');

            if (userVal === patientState.credentials.username && storedPhoneClean.endsWith(enteredPhoneClean)) {
                document.getElementById('forgot-step-1').classList.add('hidden');
                document.getElementById('forgot-step-2').classList.remove('hidden');
            } else {
                showToast("Los datos ingresados no coinciden con la cuenta", "warning");
            }
        }

        function handleSetNewPassword(e) {
            e.preventDefault();
            const newPass = document.getElementById('reset-new-password').value.trim();
            const confirmPass = document.getElementById('reset-confirm-password').value.trim();

            if (newPass.length < 4) {
                showToast("La contraseña debe tener al menos 4 caracteres", "warning");
                return;
            }

            if (newPass !== confirmPass) {
                showToast("Las contraseñas no coinciden", "warning");
                return;
            }

            patientState.credentials.password = newPass;
            saveToLocalStorage();
            closeForgotPasswordModal();
            document.getElementById('login-password').value = newPass;
            showToast("Contraseña restablecida exitosamente. Ahora puedes iniciar sesión.", "success");
        }

        function handleLogout() {
            patientState.isLoggedIn = false;
            document.getElementById('login-username').value = '';
            document.getElementById('login-password').value = '';
            document.getElementById('app-wrapper').classList.add('hidden');
            document.getElementById('login-screen').classList.remove('hidden');
            showToast("Sesión cerrada correctamente", "info");
        }
