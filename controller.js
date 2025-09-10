(function () {
  const playerCountEl  = document.getElementById('playerCount');
  const playersSection = document.getElementById('playersSection');
  const calcBtn        = document.getElementById('calcBtn');
  const statusEl       = document.getElementById('status');

  // Optional result targets in the HTML (safe if missing)
  const avgEl = document.getElementById('maxCR');
  const crEl  = document.getElementById('singleCR');

  playerCountEl.addEventListener('input', () => {
    if (playerCountEl.value.length > 2) {
      playerCountEl.value = playerCountEl.value.slice(0, 2);
    }
    const n = clamp(parseInt(playerCountEl.value || '0', 10), 0, 99);
    if (!Number.isFinite(n)) return;

    if (n === 0) {
      playersSection.innerHTML = '';
      calcBtn.disabled = true;
      /* setStatus(''); */
      return;
    }
    generatePlayerRows(n);
    validateAll();
  });

  playersSection.addEventListener('input', (e) => {
    if (e.target.matches('input[type="number"][data-level]')) {
      if (e.target.value.length > 2) {
        e.target.value = e.target.value.slice(0, 2);
      }
      const v = clamp(parseInt(e.target.value || '0', 10), 0, 20);
      if (v === 0 && e.target.value !== '') {
        e.target.value = '1';
      }
      validateAll();
    }
  });

  calcBtn.addEventListener('click', () => {
    const levels = getLevels();
    const { sum, averageRaw, averageRounded, partyCR, maxCR, singleCR } = calculatePartyMetrics(levels);

    const detail = { levels, sum, averageRaw, averageRounded, partyCR, maxCR, singleCR };
    const evt = new CustomEvent('calculateCR', { detail });
    window.dispatchEvent(evt);

    // Update UI (only if result elements exist)
    if (avgEl) avgEl.textContent = String(maxCR);
    if (crEl)  crEl.textContent  = formatCR(singleCR);

    console.clear();
    console.log('%ccalculateCR event fired', 'color:#7bd389;font-weight:bold;');
    console.log('Payload:', detail);

    /* setStatus(`Average Party Level: ${averageRounded} | Effective Party CR: ${formatCR(partyCR)}`); */
  });

  function generatePlayerRows(count) {
    const existing = playersSection.querySelectorAll('.row').length;
    if (existing === count) return;

    const frag = document.createDocumentFragment();
    playersSection.innerHTML = '';

    for (let i = 1; i <= count; i++) {
      const row = document.createElement('div');
      row.className = 'row';

      const label = document.createElement('label');
      label.setAttribute('for', `p${i}Level`);
      label.textContent = `Player ${i} level`;

      const input = document.createElement('input');
      input.type = 'number';
      input.id = `p${i}Level`;
      input.setAttribute('data-level', '');
      input.inputMode = 'numeric';
      input.min = '1';
      input.max = '20';
      input.placeholder = '1–20';

      row.appendChild(label);
      row.appendChild(input);
      frag.appendChild(row);
    }

    playersSection.appendChild(frag);
  }

  function getLevels() {
    const inputs = playersSection.querySelectorAll('input[type="number"][data-level]');
    return Array.from(inputs).map(i => clamp(parseInt(i.value || '0', 10), 1, 20));
  }

  // ==== Core math per your spec ====
  // 1) sum = total of all levels
  // 2) averageRaw = sum / numberOfPlayers
  // 3) averageRounded = round .5 up
  // 4) if averageRounded <= 4 => partyCR = sum / 4; else partyCR = sum / 2
  function calculatePartyMetrics(levels) {
    const n = levels.length || 1;
    const sum = levels.reduce((a, b) => a + b, 0);
    const averageRaw = sum / n;
    const averageRounded = roundHalfUp(averageRaw);
    const partyCR = (averageRounded <= 4) ? (sum / 4) : (sum / 2);
    const maxCR = calcMaxCR(averageRounded, sum);
    const singleCR = Math.floor(1.5 * averageRounded);
    return { sum, averageRaw, averageRounded, partyCR, maxCR, singleCR };
  }

  function calcMaxCR(x, y){
    console.log(x);
    console.log(y);
    let result = 0;
    if(x <= 4){
      result = Math.floor(y/4);
    } else if(x > 4 && x <= 10){
      result = Math.floor(y/2);
    } else if(x > 10 && x <= 17){
      result = Math.floor(y/.75);
    } else {
      result = y;
    }
    return result;
  }

  function roundHalfUp(x) {
    return Math.floor(x + 0.5);
  }

  function formatCR(v) {
    return Number.isInteger(v) ? String(v) : v.toFixed(2);
  }

  function validateAll() {
    const count = clamp(parseInt(playerCountEl.value || '0', 10), 0, 99);
    const inputs = playersSection.querySelectorAll('input[type="number"][data-level]');

    if (count === 0) {
      calcBtn.disabled = true;
      /* setStatus(''); */
      return;
    }
    if (inputs.length !== count) {
      calcBtn.disabled = true;
      /* setStatus('Generating player rows…'); */
      return;
    }

    let ok = true;
    for (const i of inputs) {
      const val = parseInt(i.value || '0', 10);
      if (!Number.isFinite(val) || val < 1 || val > 20) {
        ok = false; break;
      }
    }
    calcBtn.disabled = !ok;
    /* setStatus(ok ? '' : 'Enter each level (1–20) to enable Calculate.'); */
  }

  function clamp(n, min, max) {
    if (!Number.isFinite(n)) return min;
    return Math.min(max, Math.max(min, n));
  }

  function setStatus(msg, isError = false) {
    statusEl.textContent = msg;
    statusEl.classList.toggle('err', !!isError);
  }
})();
