// navigation.js
// Switch Tabs
        function switchTab(tabId) {
            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
            const activeTab = document.getElementById(`tab-${tabId}`);
            if (activeTab) activeTab.classList.add('active');

            // Nav Highlight Desktop
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('border-patient-500', 'text-white');
                btn.classList.add('border-transparent', 'text-slate-400');
            });
            const activeNav = document.getElementById(`nav-${tabId}`);
            if (activeNav) {
                activeNav.classList.remove('border-transparent', 'text-slate-400');
                activeNav.classList.add('border-patient-500', 'text-white');
            }

            // Nav Highlight Mobile
            const mobileTabs = ['inicio', 'citas', 'expediente', 'perfil'];
            mobileTabs.forEach(t => {
                const btn = document.getElementById(`mobile-nav-${t}`);
                if (btn) {
                    if (t === tabId) {
                        btn.className = "flex flex-col items-center gap-1 text-patient-600 font-semibold text-xs p-1";
                    } else {
                        btn.className = "flex flex-col items-center gap-1 text-slate-400 font-semibold text-xs p-1";
                    }
                }
            });
        }
