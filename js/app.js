/**
 * ELV, Networking & Computer Hardware Malayalam Learning Platform
 * Application Logic & Interactive Simulators
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initRJ45Visualizer();
  initKeystoneVisualizer();
  initCCTVCalculator();
  initPCBuilder();
  initQuiz();
  initSearch();
  initTheme();
});

/* ==========================================================================
   NAVIGATION & TAB SWITCHING
   ========================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.tab-section');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('appSidebar');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');

      // Update active nav link
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Show target section
      sections.forEach(sec => {
        sec.classList.remove('active');
        if (sec.id === targetId) {
          sec.classList.add('active');
        }
      });

      // Close mobile sidebar if open
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
      }

      // Scroll top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Mobile menu toggle
  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
  }

  // Quick jump cards
  const jumpCards = document.querySelectorAll('[data-jump]');
  jumpCards.forEach(card => {
    card.addEventListener('click', () => {
      const target = card.getAttribute('data-jump');
      const targetNav = document.querySelector(`.nav-link[data-target="${target}"]`);
      if (targetNav) targetNav.click();
    });
  });

  // Print button
  const printBtns = document.querySelectorAll('.trigger-print');
  printBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // First switch to cheatsheet section
      const cheatNav = document.querySelector('.nav-link[data-target="section-cheatsheet"]');
      if (cheatNav) cheatNav.click();
      setTimeout(() => {
        window.print();
      }, 300);
    });
  });
}

/* ==========================================================================
   RJ45 PINOUT & WIRE VISUALIZER
   ========================================================================== */
const rj45Data = {
  'T568B': [
    { pin: 1, class: 'wire-white-orange', name: 'White-Orange (ഓറഞ്ച്-വെള്ള)', signal: 'TX+ (Transmit Data +)', role: 'ഡാറ്റ അയക്കാൻ (10/100/1000 Mbps)' },
    { pin: 2, class: 'wire-orange', name: 'Orange (ഓറഞ്ച്)', signal: 'TX- (Transmit Data -)', role: 'ഡാറ്റ അയക്കാൻ (10/100/1000 Mbps)' },
    { pin: 3, class: 'wire-white-green', name: 'White-Green (പച്ച-വെള്ള)', signal: 'RX+ (Receive Data +)', role: 'ഡാറ്റ സ്വീകരിക്കാൻ (10/100/1000 Mbps)' },
    { pin: 4, class: 'wire-blue', name: 'Blue (നീല)', signal: 'PoE DC+ (പോസിറ്റീവ് പവർ)', role: 'Gigabit Data & PoE ക്യാമറ പവർ' },
    { pin: 5, class: 'wire-white-blue', name: 'White-Blue (നീല-വെള്ള)', signal: 'PoE DC+ (പോസിറ്റീവ് പവർ)', role: 'Gigabit Data & PoE ക്യാമറ പവർ' },
    { pin: 6, class: 'wire-green', name: 'Green (പച്ച)', signal: 'RX- (Receive Data -)', role: 'ഡാറ്റ സ്വീകരിക്കാൻ (10/100/1000 Mbps)' },
    { pin: 7, class: 'wire-white-brown', name: 'White-Brown (തവിട്ട്-വെള്ള)', signal: 'PoE DC- (നെഗറ്റീവ് പവർ)', role: 'Gigabit Data & PoE ക്യാമറ ഗ്രൗണ്ട്' },
    { pin: 8, class: 'wire-brown', name: 'Brown (തവിട്ട്)', signal: 'PoE DC- (നെഗറ്റീവ് പവർ)', role: 'Gigabit Data & PoE ക്യാമറ ഗ്രൗണ്ട്' }
  ],
  'T568A': [
    { pin: 1, class: 'wire-white-green', name: 'White-Green (പച്ച-വെള്ള)', signal: 'RX+ (Receive Data +)', role: 'ഡാറ്റ സ്വീകരിക്കാൻ (10/100/1000 Mbps)' },
    { pin: 2, class: 'wire-green', name: 'Green (പച്ച)', signal: 'RX- (Receive Data -)', role: 'ഡാറ്റ സ്വീകരിക്കാൻ (10/100/1000 Mbps)' },
    { pin: 3, class: 'wire-white-orange', name: 'White-Orange (ഓറഞ്ച്-വെള്ള)', signal: 'TX+ (Transmit Data +)', role: 'ഡാറ്റ അയക്കാൻ (10/100/1000 Mbps)' },
    { pin: 4, class: 'wire-blue', name: 'Blue (നീല)', signal: 'PoE DC+ (പോസിറ്റീവ് പവർ)', role: 'Gigabit Data & PoE ക്യാമറ പവർ' },
    { pin: 5, class: 'wire-white-blue', name: 'White-Blue (നീല-വെള്ള)', signal: 'PoE DC+ (പോസിറ്റീവ് പവർ)', role: 'Gigabit Data & PoE ക്യാമറ പവർ' },
    { pin: 6, class: 'wire-orange', name: 'Orange (ഓറഞ്ച്)', signal: 'TX- (Transmit Data -)', role: 'ഡാറ്റ അയക്കാൻ (10/100/1000 Mbps)' },
    { pin: 7, class: 'wire-white-brown', name: 'White-Brown (തവിട്ട്-വെള്ള)', signal: 'PoE DC- (നെഗറ്റീവ് പവർ)', role: 'Gigabit Data & PoE ക്യാമറ ഗ്രൗണ്ട്' },
    { pin: 8, class: 'wire-brown', name: 'Brown (തവിട്ട്)', signal: 'PoE DC- (നെഗറ്റീവ് പവർ)', role: 'Gigabit Data & PoE ക്യാമറ ഗ്രൗണ്ട്' }
  ]
};

function initRJ45Visualizer() {
  const container = document.getElementById('rj45WiresGrid');
  const standardBtns = document.querySelectorAll('.rj45-standard-btn');
  const detailTitle = document.getElementById('pinDetailTitle');
  const detailDesc = document.getElementById('pinDetailDesc');
  const detailSignal = document.getElementById('pinDetailSignal');

  let currentStandard = 'T568B';

  function renderWires(std) {
    if (!container) return;
    container.innerHTML = '';
    const wires = rj45Data[std];

    wires.forEach(wire => {
      const col = document.createElement('div');
      col.className = 'wire-column';
      col.innerHTML = `
        <div class="gold-pin" title="Gold Contact Pin ${wire.pin}"></div>
        <div class="wire-strand ${wire.class}"></div>
        <div class="wire-pin-number">${wire.pin}</div>
        <div class="wire-label-name">${wire.name}</div>
        <div class="wire-signal-tag">${wire.signal.split(' ')[0]}</div>
      `;

      col.addEventListener('click', () => {
        if (detailTitle) detailTitle.textContent = `Pin ${wire.pin}: ${wire.name}`;
        if (detailDesc) detailDesc.textContent = wire.role;
        if (detailSignal) detailSignal.textContent = wire.signal;

        // Visual highlight
        document.querySelectorAll('.wire-column').forEach(c => c.style.transform = '');
        col.style.transform = 'translateY(-10px)';
      });

      container.appendChild(col);
    });

    // Default select pin 1
    if (wires[0]) {
      if (detailTitle) detailTitle.textContent = `Pin 1: ${wires[0].name}`;
      if (detailDesc) detailDesc.textContent = wires[0].role;
      if (detailSignal) detailSignal.textContent = wires[0].signal;
    }
  }

  standardBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      standardBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStandard = btn.getAttribute('data-std');
      renderWires(currentStandard);
    });
  });

  renderWires(currentStandard);
}

/* ==========================================================================
   KEYSTONE JACK VISUALIZER
   ========================================================================== */
function initKeystoneVisualizer() {
  const keystoneStdBtns = document.querySelectorAll('.keystone-std-btn');
  const sideATable = document.getElementById('keystoneSideA');
  const sideBTable = document.getElementById('keystoneSideB');

  const sideAConfig = [
    { pin: '1 & 2', aColor: 'White-Green / Green', bColor: 'White-Orange / Orange' },
    { pin: '3 & 6', aColor: 'White-Orange / Orange', bColor: 'White-Green / Green' },
    { pin: '4 & 5', aColor: 'Blue / White-Blue', bColor: 'Blue / White-Blue' },
    { pin: '7 & 8', aColor: 'White-Brown / Brown', bColor: 'White-Brown / Brown' }
  ];

  keystoneStdBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      keystoneStdBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-keystone');

      const banner = document.getElementById('keystoneTipBanner');
      if (banner) {
        if (mode === 'B') {
          banner.innerHTML = '<strong>ശ്രദ്ധിക്കുക:</strong> സാധാരണയായി 95% പ്രോജക്ടുകളിലും <strong>B-സ്റ്റാൻഡേർഡ് (T568B)</strong> ആണ് കീസ്റ്റോണിൽ പഞ്ച് ചെയ്യുന്നത്. പാച്ച് പാനലിലും ഫേസ്പ്ലേറ്റിലും B കോഡ് തന്നെ കൃത്യമായി പാലിക്കുക.';
        } else {
          banner.innerHTML = '<strong>ശ്രദ്ധിക്കുക:</strong> യുണൈറ്റഡ് സ്റ്റേറ്റ്സിലെ ചില സർക്കാർ അല്ലെങ്കിൽ പഴയ ഇൻസ്റ്റാളേഷനുകളിലാണ് A-സ്റ്റാൻഡേർഡ് ഉപയോഗിക്കുന്നത്. രണ്ട് അറ്റത്തും ഒരേ സ്റ്റാൻഡേർഡ് ഉപയോഗിക്കാൻ ഉറപ്പ് വരുത്തുക.';
        }
      }
    });
  });
}

/* ==========================================================================
   CCTV STORAGE & BANDWIDTH CALCULATOR
   ========================================================================== */
function initCCTVCalculator() {
  const camCountInput = document.getElementById('calcCamCount');
  const camCountVal = document.getElementById('calcCamCountVal');
  const resSelect = document.getElementById('calcResolution');
  const codecSelect = document.getElementById('calcCodec');
  const fpsSelect = document.getElementById('calcFps');
  const daysInput = document.getElementById('calcDays');
  const recModeSelect = document.getElementById('calcRecMode');

  const outStorageGB = document.getElementById('outStorageGB');
  const outStorageTB = document.getElementById('outStorageTB');
  const outBandwidth = document.getElementById('outBandwidth');
  const outHDDRecommend = document.getElementById('outHDDRecommend');

  function calculate() {
    if (!camCountInput || !resSelect || !codecSelect || !daysInput) return;

    const cameras = parseInt(camCountInput.value) || 4;
    if (camCountVal) camCountVal.textContent = cameras;

    const resolution = resSelect.value; // '2MP', '4MP', '8MP'
    const codec = codecSelect.value; // 'h264', 'h265', 'h265plus'
    const fps = parseInt(fpsSelect.value) || 20;
    const days = parseInt(daysInput.value) || 30;
    const recHoursPerDay = parseFloat(recModeSelect.value) || 24;

    // Base Bitrate per camera in Mbps at 25 fps H.264
    let baseBitrateMbps = 4.0;
    if (resolution === '2MP') baseBitrateMbps = 4.0; // 1080p
    else if (resolution === '4MP') baseBitrateMbps = 8.0; // 2K
    else if (resolution === '8MP') baseBitrateMbps = 16.0; // 4K Ultra HD

    // Codec compression discount
    let codecMultiplier = 1.0; // H.264
    if (codec === 'h265') codecMultiplier = 0.50; // H.265 saves ~50%
    if (codec === 'h265plus') codecMultiplier = 0.30; // H.265+ Smart Codec saves ~70%

    // FPS adjustment (standard 25fps = 1.0)
    let fpsMultiplier = fps / 25;

    // Actual bitrate per camera in Mbps
    const actualBitratePerCamMbps = baseBitrateMbps * codecMultiplier * fpsMultiplier;

    // Total bandwidth in Mbps for all cameras
    const totalBandwidthMbps = actualBitratePerCamMbps * cameras;

    // Daily storage per camera:
    // Bitrate (Mbps) * 3600 sec * hours / 8 (bits to Bytes) / 1024 (MB to GB)
    // Formula: (Bitrate in Mbps * 3600 * Hours) / 8192 = GB per day per camera
    const dailyStoragePerCamGB = (actualBitratePerCamMbps * 3600 * recHoursPerDay) / 8192;
    const totalStorageGB = Math.round(dailyStoragePerCamGB * cameras * days);
    const totalStorageTB = (totalStorageGB / 1024).toFixed(2);

    // HDD Recommendation
    let hddAdvice = '1x 2TB Surveillance HDD (WD Purple / Seagate SkyHawk)';
    const tbVal = parseFloat(totalStorageTB);
    if (tbVal <= 2) {
      hddAdvice = '1x 2TB Surveillance HDD (WD Purple / Seagate SkyHawk)';
    } else if (tbVal <= 4) {
      hddAdvice = '1x 4TB Surveillance HDD';
    } else if (tbVal <= 6) {
      hddAdvice = '1x 6TB Surveillance HDD';
    } else if (tbVal <= 8) {
      hddAdvice = '1x 8TB Surveillance HDD (അല്ലെങ്കിൽ 2x 4TB)';
    } else if (tbVal <= 16) {
      hddAdvice = '2x 8TB അല്ലെങ്കിൽ 1x 16TB Enterprise HDD';
    } else {
      const count = Math.ceil(tbVal / 8);
      hddAdvice = `${count}x 8TB Surveillance HDD (NVR Raid 5 / JBOD)`;
    }

    if (outStorageGB) outStorageGB.textContent = `${totalStorageGB.toLocaleString()} GB`;
    if (outStorageTB) outStorageTB.textContent = `${totalStorageTB} TB`;
    if (outBandwidth) outBandwidth.textContent = `${totalBandwidthMbps.toFixed(1)} Mbps`;
    if (outHDDRecommend) outHDDRecommend.textContent = hddAdvice;
  }

  const inputs = [camCountInput, resSelect, codecSelect, fpsSelect, daysInput, recModeSelect];
  inputs.forEach(el => {
    if (el) {
      el.addEventListener('input', calculate);
      el.addEventListener('change', calculate);
    }
  });

  calculate();
}

/* ==========================================================================
   COMPUTER HARDWARE SPEC & POWER (SMPS) CALCULATOR
   ========================================================================== */
function initPCBuilder() {
  const cpuSelect = document.getElementById('pcCpu');
  const gpuSelect = document.getElementById('pcGpu');
  const ramSelect = document.getElementById('pcRam');
  const storageSelect = document.getElementById('pcStorage');

  const outWatts = document.getElementById('pcTotalWatts');
  const outPsu = document.getElementById('pcPsuRecommend');
  const outRating = document.getElementById('pc80PlusRecommend');

  function calculateWatts() {
    if (!cpuSelect || !gpuSelect || !ramSelect || !storageSelect) return;

    const cpuWatts = parseInt(cpuSelect.value) || 65;
    const gpuWatts = parseInt(gpuSelect.value) || 0;
    const ramWatts = parseInt(ramSelect.value) || 15;
    const storageWatts = parseInt(storageSelect.value) || 20;
    const moboFansWatts = 50; // Standard motherboard, cooling fans, RGB

    const totalPeakWatts = cpuWatts + gpuWatts + ramWatts + storageWatts + moboFansWatts;

    // Safety headroom 35-40% for SMPS efficiency curve & transient power spikes
    const recommendedPsuWatts = Math.ceil((totalPeakWatts * 1.35) / 50) * 50;

    let rating = '80 Plus Bronze';
    if (recommendedPsuWatts >= 750) rating = '80 Plus Gold / Platinum';
    else if (recommendedPsuWatts >= 550) rating = '80 Plus Bronze / Gold';

    if (outWatts) outWatts.textContent = `${totalPeakWatts} W`;
    if (outPsu) outPsu.textContent = `${recommendedPsuWatts}W SMPS ആവശ്യമാണ്`;
    if (outRating) outRating.textContent = `ശുപാർശ ചെയ്യുന്ന ഗ്രേഡ്: ${rating}`;
  }

  [cpuSelect, gpuSelect, ramSelect, storageSelect].forEach(sel => {
    if (sel) {
      sel.addEventListener('change', calculateWatts);
    }
  });

  calculateWatts();
}

/* ==========================================================================
   INTERACTIVE QUIZ (15 FIELD TECHNICIAN QUESTIONS)
   ========================================================================== */
const quizQuestions = [
  {
    q: '1. T568B സ്റ്റാൻഡേർഡ് അനുസരിച്ച് RJ45 കണക്ടറിലെ Pin 1, Pin 2 വയറുകളുടെ നിറങ്ങൾ ഏതെല്ലാമാണ്?',
    options: [
      'A) White-Green, Green',
      'B) White-Orange, Orange',
      'C) Blue, White-Blue',
      'D) White-Brown, Brown'
    ],
    correct: 1,
    exp: 'ശരിയായ ഉത്തരം B ആണ്. T568B സ്റ്റാൻഡേർഡിൽ Pin 1 White-Orange (ഓറഞ്ച്-വെള്ള) ഉം Pin 2 Orange (ഓറഞ്ച്) ഉം ആണ്.'
  },
  {
    q: '2. PoE (Power over Ethernet) സ്വിച്ച് ഉപയോഗിച്ച് ഒരു IP ക്യാമറ സാധാരണയായി പരമാവധി എത്ര മീറ്റർ ദൂരം വരെ കേബിൾ വലിക്കാം?',
    options: [
      'A) 50 മീറ്റർ',
      'B) 100 മീറ്റർ (സ്റ്റാൻഡേർഡ് Cat6 ലിമിറ്റ്)',
      'C) 250 മീറ്റർ',
      'D) 500 മീറ്റർ'
    ],
    correct: 1,
    exp: 'IEEE 802.3af/at ഇഥർനെറ്റ് സ്റ്റാൻഡേർഡ് അനുസരിച്ച് Cat6/Cat5e കേബിളുകളിൽ ഡാറ്റയും പവറും നഷ്ടമില്ലാതെ പരമാവധി 100 മീറ്റർ (328 അടി) ദൂരമാണ് അനുവദനീയം.'
  },
  {
    q: '3. അനലോഗ് സിസിടിവിയിൽ വീഡിയോ സിഗ്നൽ കടത്തിവിടാൻ ഉപയോഗിക്കുന്ന കേബിളും കണക്ടറും ഏതാണ്?',
    options: [
      'A) Cat6 കേബിൾ & RJ45 കണക്ടർ',
      'B) RG59 കോക്സിയൽ കേബിൾ & BNC കണക്ടർ',
      'C) ഫൈബർ ഒപ്റ്റിക് & LC കണക്ടർ',
      'D) HDMI കേബിൾ'
    ],
    correct: 1,
    exp: 'അനലോഗ് (HD-TVI / HD-CVI / AHD) ക്യാമറകളിൽ RG59 അല്ലെങ്കിൽ RG6 കോക്സിയൽ കേബിളും BNC (Bayonet Neill–Concelman) കണക്ടറുമാണ് ഉപയോഗിക്കുന്നത്.'
  },
  {
    q: '4. ഒരു 110 Punch Down Tool (ഇംപാക്റ്റ് ടൂൾ) ഉപയോഗിച്ച് കീസ്റ്റോൺ ജാക്കിൽ കേബിൾ പഞ്ച് ചെയ്യുമ്പോൾ ശ്രദ്ധിക്കേണ്ട പ്രധാന കാര്യം എന്താണ്?',
    options: [
      'A) വയർ ട്വിസ്റ്റ് 3 ഇഞ്ച് നീളത്തിൽ അഴിച്ചു മാറ്റണം',
      'B) ടൂളിന്റെ കട്ടിംഗ് ബ്ലേഡ് (Cut side) പുറത്തേക്ക് ആയിരിക്കണം',
      'C) ടൂളിന്റെ കട്ടിംഗ് ബ്ലേഡ് ഉള്ളിലേക്ക് ആയിരിക്കണം',
      'D) കേബിളിന് തീ കത്തിച്ച് ഇൻസുലേഷൻ നീക്കണം'
    ],
    correct: 1,
    exp: 'കട്ടിംഗ് ബ്ലേഡ് ഉള്ളിലേക്ക് വെച്ചാൽ കണക്ഷൻ വയർ മുറിഞ്ഞു പോകും! അതിനാൽ ടൂളിന്റെ കട്ടിംഗ് ബ്ലേഡ് എപ്പോഴും കീസ്റ്റോൺ ജാക്കിന് പുറത്തേക്ക് (അധികമുള്ള വയർ മുറിക്കാൻ) ആയിരിക്കണം.'
  },
  {
    q: '5. ഡോർ ആക്സസ് കൺട്രോൾ സിസ്റ്റത്തിൽ (Access Control) പവർ കട്ട് ആകുമ്പോൾ സ്വയമേവ ഡോർ തുറന്നുപോകുന്ന ലോക്കിന്റെ തരം ഏതാണ്?',
    options: [
      'A) Fail-Secure Lock',
      'B) Fail-Safe Lock (ഉദാ: EM Magnetic Lock)',
      'C) മാനുവൽ പാഡ്‌ലോക്ക്',
      'D) മോട്ടോർ ലോക്ക്'
    ],
    correct: 1,
    exp: 'Fail-Safe ലോക്കുകൾ (Magnetic Lock) പവർ നഷ്ടപ്പെടുമ്പോൾ എമർജൻസി എക്സിറ്റിനായി ലോക്ക് റിലീസ് ചെയ്യും. ജീവൻ രക്ഷിക്കാനുള്ള ഫയർ സേഫ്റ്റി മാനദണ്ഡമാണിത്.'
  },
  {
    q: '6. കമ്പ്യൂട്ടറിൽ ഡാറ്റ സൂക്ഷിക്കുന്നതിൽ ഏറ്റവും വേഗത കൂടിയ സ്റ്റോറേജ് ഉപകരണം ഏതാണ്?',
    options: [
      'A) 7200 RPM SATA HDD (മെക്കാനിക്കൽ ഹാർഡ് ഡിസ്ക്)',
      'B) 2.5 ഇഞ്ച് SATA SSD (500 MB/s)',
      'C) M.2 NVMe PCIe Gen 4 SSD (5000 - 7000 MB/s)',
      'D) ഫ്ലാപ്പി ഡിസ്ക്'
    ],
    correct: 2,
    exp: 'M.2 NVMe PCIe SSD-കൾ മദർബോർഡിലെ PCIe ലെയ്‌നുകളുമായി നേരിട്ട് ബന്ധപ്പെടുന്നതിനാൽ 7000 MB/s വരെ അതിവേഗത നൽകുന്നു.'
  },
  {
    q: '7. കമ്പ്യൂട്ടർ ഓൺ ചെയ്യുമ്പോൾ ഡിസ്പ്ലേ വരാതിരിക്കുകയും ഫാൻ കറങ്ങുകയും ചെയ്യുമ്പോൾ ടെക്നീഷ്യൻ ആദ്യം പരിശോധിക്കേണ്ട ഘടകം ഏതാണ്?',
    options: [
      'A) മൗസ് മാറ്റുക',
      'B) റാം (RAM) ഊരി റബ്ബർ ഇറേസർ ഉപയോഗിച്ച് ഗോൾഡൻ പിന്നുകൾ വൃത്തിയാക്കി തിരികെ ഇടുക',
      'C) ഹാർഡ് ഡിസ്ക് ഫോർമാറ്റ് ചെയ്യുക',
      'D) പുതിയ മോണിറ്റർ വാങ്ങുക'
    ],
    correct: 1,
    exp: 'No Display പ്രശ്നങ്ങളുടെ 80 ശതമാനവും റാമിന്റെ കോൺടാക്റ്റുകളിൽ പൊടി അല്ലെങ്കിൽ കാർബൺ പിടിക്കുന്നത് കൊണ്ടാണ്. റബ്ബർ ഇറേസർ ഉപയോഗിച്ച് മൃദുവായി ക്ലീൻ ചെയ്ത് സ്ലോട്ട് 2 അല്ലെങ്കിൽ 4-ൽ ഉറപ്പിച്ചാൽ ഡിസ്പ്ലേ ലഭിക്കും.'
  },
  {
    q: '8. ഒരു പിസിയിൽ നിന്ന് സ്വിച്ചിലേക്കോ എൻ.വി.ആറിലേക്കോ കേബിൾ കണക്ട് ചെയ്യാൻ ഏത് തരം ക്രിമ്പിംഗ് രീതിയാണ് ഉപയോഗിക്കുന്നത്?',
    options: [
      'A) ക്രോസ്സ്ഓവർ കേബിൾ (Crossover)',
      'B) സ്ട്രെയിറ്റ്-ത്രൂ കേബിൾ (Straight-Through - രണ്ട് വശത്തും T568B)',
      'C) സീരിയൽ കേബിൾ',
      'D) കോക്സിയൽ കേബിൾ'
    ],
    correct: 1,
    exp: 'വ്യത്യസ്ത ഉപകരണങ്ങൾ (PC ടു Switch, NVR ടു Switch) തമ്മിൽ കണക്ട് ചെയ്യാൻ Straight-Through കേബിളാണ് ഉപയോഗിക്കുന്നത് (രണ്ട് വശത്തും T-568B).'
  },
  {
    q: '9. Hikvision IP ക്യാമറകളുടെ നെറ്റ്‌വർക്കിലെ IP അഡ്രസ്സ് കണ്ടെത്താനും ആക്റ്റിവേറ്റ് ചെയ്യാനും ഉപയോഗിക്കുന്ന സോഫ്റ്റ്‌വെയർ ഏതാണ്?',
    options: [
      'A) VLC Player',
      'B) SADP Tool',
      'C) WinRAR',
      'D) MS Word'
    ],
    correct: 1,
    exp: 'Hikvision IP ക്യാമറകൾ, NVR എന്നിവ ലോക്കൽ നെറ്റ്‌വർക്കിൽ കണ്ടെത്താനും പുതിയ പാസ്‌വേഡ് സെറ്റ് ചെയ്യാനും ഉപയോഗിക്കുന്ന ഔദ്യോഗിക ടൂളാണ് SADP (Search Active Devices Protocol).'
  },
  {
    q: '10. മദർബോർഡിൽ സമയവും BIOS ക്രമീകരണങ്ങളും പവർ ഓഫ് ആയാലും സൂക്ഷിക്കാൻ സഹായിക്കുന്ന 3V ബാറ്ററി ഏതാണ്?',
    options: [
      'A) AA പെൻസിൽ ബാറ്ററി',
      'B) CR2032 ലിഥിയം കോയിൻ സെൽ ബാറ്ററി',
      'C) 9V സ്ക്വയർ ബാറ്ററി',
      'D) മൊബൈൽ ബാറ്ററി'
    ],
    correct: 1,
    exp: 'എല്ലാ ഡെസ്ക്ടോപ്പ് മദർബോർഡുകളിലും CMOS മെമ്മറിയും RTC (Real Time Clock) ക്ലോക്കും നിലനിർത്തുന്നത് CR2032 3V ലിഥിയം കോയിൻ ബാറ്ററിയാണ്.'
  },
  {
    q: '11. CCTV സിസ്റ്റത്തിൽ H.264 ന് പകരം H.265 അല്ലെങ്കിൽ H.265+ കോഡെക് ഉപയോഗിച്ചാൽ ഉണ്ടാകുന്ന ഗുണം എന്താണ്?',
    options: [
      'A) ക്യാമറ ചൂടാകും',
      'B) ഹാർഡ് ഡിസ്ക് സ്റ്റോറേജും നെറ്റ്‌വർക്ക് ബാൻഡ്‌വിഡ്ത്തും 50% മുതൽ 70% വരെ ലാഭിക്കാം',
      'C) വീഡിയോ ബ്ലാക്ക് ആൻഡ് വൈറ്റ് ആകും',
      'D) ക്യാമറയുടെ റെസല്യൂഷൻ കുറയും'
    ],
    correct: 1,
    exp: 'H.265 (HEVC) നൂതന കംപ്രഷൻ അൽഗോരിതം ഉപയോഗിക്കുന്നതിനാൽ ഇമേജ് ക്വാളിറ്റി നഷ്ടപ്പെടാതെ പകുതി സ്റ്റോറേജിൽ കൂടുതൽ ദിവസത്തെ റെക്കോർഡിംഗ് ലഭിക്കും.'
  },
  {
    q: '12. RJ45 കേബിൾ ക്രിമ്പ് ചെയ്ത ശേഷം LAN Cable Tester-ൽ നോർമൽ സ്ട്രെയിറ്റ് കേബിളിന്റെ ലൈറ്റുകൾ എങ്ങനെ തെളിയണം?',
    options: [
      'A) 1, 3, 5, 7 മാത്രം തെളിയണം',
      'B) രണ്ട് യൂണിറ്റിലും 1 മുതൽ 8 വരെയുള്ള ലൈറ്റുകൾ ഒരേ സമയം ക്രമത്തിൽ (1-2-3-4-5-6-7-8) തെളിയണം',
      'C) ഏതെങ്കിലും 2 ലൈറ്റുകൾ മിന്നിയാൽ മതി',
      'D) ടെസ്റ്റർ ലൈറ്റുകൾ തെളിയാൻ പാടില്ല'
    ],
    correct: 1,
    exp: 'ശരിയായ Straight-Through കേബിളിൽ മാസ്റ്റർ യൂണിറ്റിലും റിമോട്ട് യൂണിറ്റിലും 1 മുതൽ 8 വരെയുള്ള LED ലൈറ്റുകൾ ക്രമത്തിൽ ഒരേസമയം തെളിയണം. ഏതെങ്കിലും ലൈറ്റ് തെളിഞ്ഞില്ലെങ്കിൽ ആ വയർ കണക്റ്റായിട്ടില്ല.'
  },
  {
    q: '13. പബ്ലിക് അഡ്രസ്സ് (PA System) സിസ്റ്റത്തിൽ വലിയ ദൂരങ്ങളിലേക്ക് ശബ്ദം എത്തിക്കാൻ സ്പീക്കറുകളിൽ ഉപയോഗിക്കുന്ന വോൾട്ടേജ് ലൈൻ ഏതാണ്?',
    options: [
      'A) 5V USB ലൈൻ',
      'B) 100V / 70V കോൺസ്റ്റന്റ് വോൾട്ടേജ് ലൈൻ ട്രാൻസ്ഫോർമർ',
      'C) 440V ത്രീ ഫേസ് ലൈൻ',
      'D) 12V കാർ ബാറ്ററി ലൈൻ'
    ],
    correct: 1,
    exp: 'PA സിസ്റ്റങ്ങളിൽ കിലോമീറ്ററുകളോളം കേബിൾ സിഗ്നൽ നഷ്ടമില്ലാതെ വലിയ തോതിൽ സീലിംഗ് സ്പീക്കറുകൾ പാരലൽ ആയി നൽകാൻ 100V ഹൈ ഇംപെഡൻസ് ലൈൻ ട്രാൻസ്ഫോർമറുകളാണ് ഉപയോഗിക്കുന്നത്.'
  },
  {
    q: '14. ഒരു പ്രൊഫഷണൽ ഗെയിമിംഗ് അല്ലെങ്കിൽ ഗ്രാഫിക്സ് PC ബിൽഡ് ചെയ്യുമ്പോൾ SMPS-ൽ ശ്രദ്ധിക്കേണ്ട 80-Plus റേറ്റിംഗ് എന്തിനെ സൂചിപ്പിക്കുന്നു?',
    options: [
      'A) പവർ സപ്ലൈയുടെ ഊർജ്ജ കാര്യക്ഷമത (Energy Efficiency 80% മുകളിൽ ഉറപ്പാക്കുന്നു)',
      'B) 80 ഡിഗ്രി ചൂടാകും എന്ന മുന്നറിയിപ്പ്',
      'C) 80 കിലോ ഭാരമുണ്ട് എന്ന്',
      'D) 80 വർഷത്തെ വാറന്റി'
    ],
    correct: 0,
    exp: '80 Plus സർട്ടിഫിക്കേഷൻ ഉറപ്പ് നൽകുന്നത് SMPS കറന്റ് വലിക്കുമ്പോൾ കുറഞ്ഞത് 80% എനർജി വേസ്റ്റേജ് ഇല്ലാതെ കമ്പ്യൂട്ടറിലേക്ക് കൃത്യമായ DC കറന്റായി മാറ്റുന്നു എന്നാണ് (Bronze, Gold, Platinum).'
  },
  {
    q: '15. അഡ്രസ്സബിൾ ഫയർ അലാറം സിസ്റ്റത്തിന്റെ (Addressable Fire Alarm) ഏറ്റവും വലിയ സവിശേഷത എന്താണ്?',
    options: [
      'A) സൈറൺ ശബ്ദമില്ല',
      'B) കെട്ടിടത്തിൽ ഏത് മുറിയിലെ ഏത് സ്മോക്ക് ഡിറ്റക്ടറാണ് പുക കണ്ടുപിടിച്ചതെന്ന് കൺട്രോൾ പാനലിൽ കൃത്യമായി കാണാം',
      'C) വെള്ളം സ്വയം പമ്പ് ചെയ്യും',
      'D) സ്വിച്ച് ഓഫ് ചെയ്യാൻ കഴിയില്ല'
    ],
    correct: 1,
    exp: 'അഡ്രസ്സബിൾ ഫയർ അലാറം പാനലിൽ ഓരോ ഡിറ്റക്ടറിനും പ്രത്യേക ഡിജിറ്റൽ ഐഡി (Address) ഉള്ളതിനാൽ തീപിടുത്തം ഏത് ഫ്ലോറിലെ ഏത് റൂമിലാണെന്ന് സ്ക്രീനിൽ തത്സമയം കാണാൻ സാധിക്കുന്നു.'
  }
];

function initQuiz() {
  let currentIdx = 0;
  let score = 0;
  let answered = new Array(quizQuestions.length).fill(null);

  const qTitle = document.getElementById('quizQTitle');
  const qOptions = document.getElementById('quizOptions');
  const qExp = document.getElementById('quizExp');
  const qProgress = document.getElementById('quizProgress');
  const prevBtn = document.getElementById('quizPrevBtn');
  const nextBtn = document.getElementById('quizNextBtn');

  function renderQuestion(idx) {
    if (!qTitle || !qOptions) return;

    const cur = quizQuestions[idx];
    qTitle.textContent = cur.q;
    if (qProgress) qProgress.textContent = `ചോദ്യം ${idx + 1} / ${quizQuestions.length}`;

    qOptions.innerHTML = '';
    if (qExp) qExp.style.display = 'none';

    cur.options.forEach((opt, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.textContent = opt;

      // Check if already answered
      if (answered[idx] !== null) {
        btn.disabled = true;
        if (optIdx === cur.correct) {
          btn.classList.add('selected-correct');
        } else if (optIdx === answered[idx]) {
          btn.classList.add('selected-wrong');
        }
      }

      btn.addEventListener('click', () => {
        answered[idx] = optIdx;
        const allBtns = qOptions.querySelectorAll('.quiz-option-btn');
        allBtns.forEach(b => b.disabled = true);

        if (optIdx === cur.correct) {
          btn.classList.add('selected-correct');
          score++;
        } else {
          btn.classList.add('selected-wrong');
          // Highlight correct
          if (allBtns[cur.correct]) allBtns[cur.correct].classList.add('selected-correct');
        }

        if (qExp) {
          qExp.textContent = cur.exp;
          qExp.style.display = 'block';
        }
      });

      qOptions.appendChild(btn);
    });

    if (answered[idx] !== null && qExp) {
      qExp.textContent = cur.exp;
      qExp.style.display = 'block';
    }

    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) {
      if (idx === quizQuestions.length - 1) {
        nextBtn.textContent = 'റിസൾട്ട് കാണുക (Finish)';
      } else {
        nextBtn.textContent = 'അടുത്ത ചോദ്യം ➡️';
      }
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIdx > 0) {
        currentIdx--;
        renderQuestion(currentIdx);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIdx < quizQuestions.length - 1) {
        currentIdx++;
        renderQuestion(currentIdx);
      } else {
        // Show result modal or summary
        showQuizResult(score, quizQuestions.length);
      }
    });
  }

  function showQuizResult(finalScore, total) {
    const percentage = Math.round((finalScore / total) * 100);
    let feedback = '';
    if (percentage >= 80) feedback = '🌟 അഭിനന്ദനങ്ങൾ! നിങ്ങൾക്ക് ELV, Networking & Hardware ഫീൽഡിൽ മികച്ച അറിവുണ്ട്.';
    else if (percentage >= 50) feedback = '👍 നല്ല പ്രകടനം! ചില ഭാഗങ്ങൾ കൂടി വീണ്ടും വായിച്ചു പഠിക്കുക.';
    else feedback = '📖 കോഴ്സ് കണ്ടെന്റുകൾ വീണ്ടും ശ്രദ്ധാപൂർവ്വം വായിച്ച് ഒരിക്കൽ കൂടി പരീക്ഷ എഴുതുക.';

    alert(`നിങ്ങളുടെ പരീക്ഷാ ഫലം:\n\nസ്കോർ: ${finalScore} / ${total} (${percentage}%)\n\n${feedback}`);
  }

  renderQuestion(0);
}

/* ==========================================================================
   GLOBAL SEARCH (MALAYALAM & ENGLISH)
   ========================================================================== */
function initSearch() {
  const searchInput = document.getElementById('globalSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      // Clear any highlights
      return;
    }

    // Search keywords mapping to section IDs
    const searchMap = [
      { terms: ['elv', 'extra low voltage', 'വോൾട്ടേജ്', 'നെറ്റ്വർക്കിംഗ്', 'ip address', 'സബ്നെറ്റ്', 'മാക്', 'switch', 'router', 'cat6', 'fiber'], target: 'section-networking' },
      { terms: ['camera', 'ക്യാമറ', 'cctv', 'dome', 'bullet', 'ptz', 'lens', 'ലെൻസ്', 'fov', 'ip67', 'വാട്ടർപ്രൂഫ്'], target: 'section-camera-install' },
      { terms: ['analogue', 'അനലോഗ്', 'ip camera', 'dvr', 'nvr', 'bnc', 'rg59', 'sadp', 'hik-connect', 'onvif', 'കോക്സിയൽ'], target: 'section-analogue-ip' },
      { terms: ['rj45', 'കളർ കോഡ്', 'ക്രിമ്പിംഗ്', 't568a', 't568b', 'crimping', 'stripper', 'straight', 'crossover', 'ടെസ്റ്റർ'], target: 'section-rj45' },
      { terms: ['keystone', 'കീസ്റ്റോൺ', 'punch down', 'പഞ്ച് ഡൗൺ', 'ഫേസ്പ്ലേറ്റ്', 'ഐഓ', 'i/o', 'krone', '110 tool'], target: 'section-keystone' },
      { terms: ['access control', 'ആക്സസ്', 'em lock', 'rfid', 'ഫയർ അലാറം', 'fire alarm', 'pa system', 'സ്പീക്കർ', 'ഇന്റർകോം', 'intercom'], target: 'section-elv-systems' },
      { terms: ['hardware', 'ഹാർഡ്‌വെയർ', 'motherboard', 'മദർബോർഡ്', 'cpu', 'പ്രോസസ്സർ', 'ram', 'റാം', 'ssd', 'hdd', 'smps', 'പവർ സപ്ലൈ', 'bios', 'no display'], target: 'section-computer-hardware' },
      { terms: ['calculator', 'കാൽക്കുലേറ്റർ', 'സ്റ്റോറേജ്', 'storage', 'വാട്ടേജ്', 'wattage', 'ടൂൾ'], target: 'section-tools' },
      { terms: ['cheatsheet', 'ചീറ്റ് ഷീറ്റ്', 'റഫറൻസ്', 'പോർട്ട് നമ്പർ', 'പ്രിന്റ്'], target: 'section-cheatsheet' },
      { terms: ['quiz', 'ക്വിസ്', 'പരീക്ഷ', 'ചോദ്യം'], target: 'section-quiz' },
      { terms: ['glossary', 'ഡിക്ഷണറി', 'നിഘണ്ടു', 'പദാവലി'], target: 'section-glossary' }
    ];

    for (const item of searchMap) {
      if (item.terms.some(t => query.includes(t) || t.includes(query))) {
        const targetNav = document.querySelector(`.nav-link[data-target="${item.target}"]`);
        if (targetNav && !targetNav.classList.contains('active')) {
          targetNav.click();
          break;
        }
      }
    }
  });
}

/* ==========================================================================
   THEME SWITCHER
   ========================================================================== */
function initTheme() {
  const themeBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('elv_theme') || 'dark';

  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    if (themeBtn) themeBtn.textContent = '🌙';
  } else {
    document.body.classList.remove('light-theme');
    if (themeBtn) themeBtn.textContent = '☀️';
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      localStorage.setItem('elv_theme', isLight ? 'light' : 'dark');
      themeBtn.textContent = isLight ? '🌙' : '☀️';
    });
  }
}
