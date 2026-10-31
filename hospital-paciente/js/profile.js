// profile.js
// Profile Form Setup and Sync
        function populateProfileForm() {
            const p = patientState.profile;
            document.getElementById('profile-name').value = p.name || '';
            document.getElementById('profile-gender').value = p.gender || 'femenino';
            document.getElementById('profile-exp').value = p.exp || '';
            document.getElementById('profile-email').value = p.email || '';
            
            // Clean initial phone value to prevent duplicating +502 in prefix box
            document.getElementById('profile-phone').value = (p.phone || '').replace(/^(\+502\s?)/, '');
            document.getElementById('profile-emergency-contact').value = p.emergencyContact || '';

            document.getElementById('profile-dob').value = p.dob || '';

            document.getElementById('profile-blood-display').innerText = p.blood || 'Sin Registrar';
            document.getElementById('profile-bp-display').innerText = p.bp || '--/-- mmHg';
            document.getElementById('profile-hr-display').innerText = p.hr || '-- lpm';
            document.getElementById('profile-allergies-display').innerText = p.allergies || 'Ninguna';

            document.getElementById('exp-bp').innerText = p.bp || '--/-- mmHg';
            document.getElementById('exp-hr').innerText = p.hr || '-- lpm';
            document.getElementById('exp-blood').innerText = p.blood || 'Sin Registrar';
            document.getElementById('exp-allergies').innerText = p.allergies || 'Ninguna';

            updateHeaderProfile();
        }

        function handleProfileUpdate(e) {
            e.preventDefault();
            const phoneInput = document.getElementById('profile-phone').value.trim();
            const emergencyInput = document.getElementById('profile-emergency-contact').value.trim();

            const phoneDigitsRegex = /^[2-7][0-9]{3}[-\s]?[0-9]{4}$/;
            if (!phoneDigitsRegex.test(phoneInput)) {
                showToast("Por favor ingresa un número de teléfono válido de 8 dígitos", "warning");
                return;
            }

            patientState.profile.name = document.getElementById('profile-name').value.trim();
            patientState.profile.gender = document.getElementById('profile-gender').value;
            patientState.profile.email = document.getElementById('profile-email').value.trim();
            patientState.profile.phone = `+502 ${phoneInput}`;
            patientState.profile.emergencyContact = emergencyInput;
            patientState.profile.dob = document.getElementById('profile-dob').value;

            saveToLocalStorage();
            updateHeaderProfile();
            showToast("Perfil actualizado y guardado localmente", "success");
        }

        function handleGenderChange() {
            const genderVal = document.getElementById('profile-gender').value;
            patientState.profile.gender = genderVal;
            
            // Actualizar la foto inmediatamente en el menú superior al seleccionar femenino o masculino
            const avatarImg = document.getElementById('header-avatar');
            if (avatarImg) {
                avatarImg.src = avatarMap[genderVal] || avatarMap.femenino;
            }
            
            saveToLocalStorage();
            updateHeaderProfile();
        }

        function updateHeaderProfile() {
            const p = patientState.profile;
            const firstName = p.name ? (p.name.split(' ')[0] || p.name) : 'Paciente';
            document.getElementById('header-patient-name').innerText = p.name || 'Sin Nombre';
            document.getElementById('header-patient-exp').innerText = p.exp || '';
            document.getElementById('welcome-patient-name').innerText = firstName;
            
            const avatarImg = document.getElementById('header-avatar');
            if (avatarImg) {
                avatarImg.src = avatarMap[p.gender] || avatarMap.femenino;
            }
        }
