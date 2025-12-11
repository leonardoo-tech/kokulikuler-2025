document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. DATA PERTUNJUKAN (Data Dummy)
    // ----------------------------------------------------------------------
    const pertunjukanData = [
        { 
            id: 1, 
            nama: "Tari Saman", 
            daerah: "sumatera", 
            jenis: "Tari", 
            deskripsi: "Tari tangan seribu dari Aceh yang penuh kekompakan. Tarian ini melambangkan nilai-nilai spiritual, kekompakan, dan persatuan.", 
            imageUrl: "images/tari_saman.jpg" 
        },
        { 
            id: 2, 
            nama: "Wayang Kulit", 
            daerah: "jawa", 
            jenis: "Teater", 
            deskripsi: "Pertunjukan bayangan semalam suntuk dengan lakon Mahabarata/Ramayana. Dalang menggunakan keterampilan narasi dan memainkan puluhan karakter bayangan.", 
            imageUrl: "images/wayang.png" 
        },
        { 
            id: 3, 
            nama: "Gamelan Bali", 
            daerah: "bali", 
            jenis: "Musik", 
            deskripsi: "Ensemble musik tradisional dengan ritme yang cepat, dinamis, dan kompleks. Musik ini sering mengiringi upacara keagamaan dan tarian.", 
            imageUrl: "images/gamelan_bali.jpg" 
        },
        { 
            id: 4, 
            nama: "Reog Ponorogo", 
            daerah: "jawa", 
            jenis: "Tari", 
            deskripsi: "Tarian kolosal dari Jawa Timur dengan topeng singa barong (Dadak Merak) yang ikonik, melambangkan kisah kepahlawanan dan kekuatan.", 
            imageUrl: "images/reog.jpg" 
        },
    ];

    // Data Dummy Jadwal Acara (Tanggal harus dalam format YYYY-MM-DD)
    const jadwalAcara = [
        { date: "2025-12-15", name: "Pentas Tari Saman Aceh", location: "Balai Kota", id: 1 },
        { date: "2025-12-24", name: "Malam Wayang Kulit", location: "Keraton", id: 2 },
        { date: "2026-01-05", name: "Konser Gamelan Gong Kebyar", location: "Ubud", id: 3 },
        { date: "2025-12-08", name: "Latihan Reog", location: "Alun-Alun", id: 4 },
        { date: "2025-12-08", name: "Festival Budaya Nusantara", location: "Taman Mini", id: 0 },
    ];

    const pertunjukanList = document.getElementById('pertunjukanList');
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const regionFilter = document.getElementById('regionFilter');

    // Inisialisasi Modal
    const detailModal = document.getElementById('detailModal');
    const closeButton = detailModal.querySelector('.close-button');
    const modalBody = document.getElementById('modalBody');


    // ----------------------------------------------------------------------
    // 2. FUNGSI LOGIKA MODAL (Lihat Detail)
    // ----------------------------------------------------------------------

    /**
     * Menampilkan modal detail pertunjukan
     */
    function showDetail(event) {
        event.preventDefault(); 
        
        const pertunjukanId = parseInt(event.target.getAttribute('data-id'));
        const detail = pertunjukanData.find(p => p.id === pertunjukanId);

        if (detail) {
            // Mengisi konten modal
            modalBody.innerHTML = `
                <img src="${detail.imageUrl}" alt="${detail.nama}">
                <h3>${detail.nama}</h3>
                <p><strong>Jenis:</strong> ${detail.jenis}</p>
                <p><strong>Daerah Asal:</strong> ${detail.daerah.toUpperCase()}</p>
                <hr>
                <p>${detail.deskripsi}</p>
                <p>Seni pertunjukan ini adalah wujud nyata dari warisan budaya yang kaya dan otentik di Indonesia.</p>
            `;
            
            // Tampilkan modal
            detailModal.style.display = 'block';
        }
    }

    // Fungsi menutup modal saat tombol 'x' diklik
    closeButton.onclick = function() {
        detailModal.style.display = 'none';
    }

    // Menutup modal jika user klik di luar kotak modal
    window.onclick = function(event) {
        if (event.target == detailModal) {
            detailModal.style.display = 'none';
        }
    }


    // ----------------------------------------------------------------------
    // 3. FUNGSI ARSIP PERTUNJUKAN (Pencarian & Filter)
    // ----------------------------------------------------------------------

    function renderPertunjukan(data) {
        pertunjukanList.innerHTML = ''; 

        if (data.length === 0) {
            pertunjukanList.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Maaf, pertunjukan tidak ditemukan.</p>';
            return;
        }

        data.forEach(p => {
            const card = document.createElement('div');
            card.className = 'card-pertunjukan';
            card.innerHTML = `
                <img src="${p.imageUrl}" alt="Gambar ${p.nama}">
                <div class="card-content">
                    <h3>${p.nama}</h3>
                    <p><strong>Daerah:</strong> ${p.daerah.toUpperCase()}</p>
                    <p>${p.deskripsi}</p>
                    <a href="#" data-id="${p.id}" class="detail-link" style="color: var(--primary-color); font-weight: 600;">Lihat Detail →</a>
                </div>
            `;
            pertunjukanList.appendChild(card);
            
            // Pasang event listener ke tombol "Lihat Detail"
            const detailLink = card.querySelector('.detail-link');
            detailLink.onclick = showDetail;
        });
    }

    function filterAndSearch() {
        const query = searchInput.value.toLowerCase();
        const region = regionFilter.value;

        const filtered = pertunjukanData.filter(p => {
            const regionMatch = region === 'all' || p.daerah === region;
            const queryMatch = p.nama.toLowerCase().includes(query) || 
                               p.deskripsi.toLowerCase().includes(query);

            return regionMatch && queryMatch;
        });

        renderPertunjukan(filtered);
    }

    searchButton.addEventListener('click', filterAndSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') filterAndSearch();
    });
    regionFilter.addEventListener('change', filterAndSearch);

    renderPertunjukan(pertunjukanData);


    // ----------------------------------------------------------------------
    // 4. FUNGSI KALENDER ACARA (Logika Navigasi dan Tampilan Ringkas)
    // ----------------------------------------------------------------------
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthYearHeader = document.getElementById('currentMonthYear');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');

    let currentDisplayDate = new Date(); 

    function generateCalendar(date) {
        calendarGrid.innerHTML = '';
        const year = date.getFullYear();
        const month = date.getMonth(); 

        currentMonthYearHeader.textContent = `${date.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}`;
        
        const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
        dayNames.forEach(day => {
            const dayNameDiv = document.createElement('div');
            dayNameDiv.className = 'day-name';
            dayNameDiv.textContent = day;
            calendarGrid.appendChild(dayNameDiv);
        });

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.style.backgroundColor = 'transparent';
            emptyDiv.style.boxShadow = 'none';
            calendarGrid.appendChild(emptyDiv);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            dayDiv.innerHTML = `<span class="day-number">${day}</span>`;

            const eventsOnThisDay = jadwalAcara.filter(event => event.date === dateString);
            
            if (eventsOnThisDay.length > 0) {
                eventsOnThisDay.forEach(event => {
                    const eventMarker = document.createElement('span');
                    eventMarker.className = 'event-marker';
                    
                    const maxLength = 12; 
                    const eventNameDisplay = event.name.length > maxLength 
                        ? event.name.substring(0, maxLength) + '...' 
                        : event.name;
                        
                    eventMarker.textContent = eventNameDisplay;
                    eventMarker.title = `${event.name} (${event.location})`; 
                    
                    dayDiv.appendChild(eventMarker);
                    
                    dayDiv.style.border = '2px solid var(--secondary-color)'; 
                });
            }

            calendarGrid.appendChild(dayDiv);
        }
    }

    prevMonthButton.addEventListener('click', () => {
        currentDisplayDate.setMonth(currentDisplayDate.getMonth() - 1);
        generateCalendar(currentDisplayDate);
    });

    nextMonthButton.addEventListener('click', () => {
        currentDisplayDate.setMonth(currentDisplayDate.getMonth() + 1);
        generateCalendar(currentDisplayDate);
    });

    generateCalendar(currentDisplayDate);
});