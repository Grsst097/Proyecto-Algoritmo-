// ui.js
// SOS Modal
        function triggerSOSModal() {
            document.getElementById('modal-sos').classList.remove('hidden');
        }

        function closeSOSModal() {
            document.getElementById('modal-sos').classList.add('hidden');
        }

        function requestHospitalAmbulance() {
            closeSOSModal();
            showToast("Unidad de ambulancia solicitada. Un operador se comunicará de inmediato.", "warning");
        }

        // Toast Notification System
        function showToast(message, type = 'info') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');

            const bgColors = {
                success: 'bg-emerald-600 text-white',
                warning: 'bg-amber-500 text-white',
                info: 'bg-slate-900 text-white'
            };

            const icons = {
                success: 'fa-circle-check',
                warning: 'fa-triangle-exclamation',
                info: 'fa-circle-info'
            };

            toast.className = `pointer-events-auto px-4 py-3 rounded-2xl shadow-xl font-medium text-xs flex items-center gap-3 transition-all duration-300 transform translate-y-2 opacity-0 ${bgColors[type] || bgColors.info}`;
            toast.innerHTML = `
                <i class="fa-solid ${icons[type] || icons.info} text-base"></i>
                <span>${message}</span>
            `;

            container.appendChild(toast);

            setTimeout(() => {
                toast.classList.remove('translate-y-2', 'opacity-0');
            }, 10);

            setTimeout(() => {
                toast.classList.add('opacity-0', 'translate-y-2');
                setTimeout(() => toast.remove(), 300);
            }, 3500);
        }
