let currentMode = 'cpm';

function switchMode(mode) {
  currentMode = mode;

  const btnCpm = document.getElementById('tab-cpm');
  const btnCost = document.getElementById('tab-cost');
  const btnImp = document.getElementById('tab-impressions');

  const activeClass = 'px-4 py-2 text-xs font-bold rounded-xl bg-emerald-700 text-white shadow-sm transition';
  const inactiveClass = 'px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition';

  if (btnCpm) btnCpm.className = (mode === 'cpm') ? activeClass : inactiveClass;
  if (btnCost) btnCost.className = (mode === 'cost') ? activeClass : inactiveClass;
  if (btnImp) btnImp.className = (mode === 'impressions') ? activeClass : inactiveClass;

  const wrapCost = document.getElementById('wrapper-cost');
  const wrapCpm = document.getElementById('wrapper-cpm');
  const wrapImp = document.getElementById('wrapper-impressions');

  if (mode === 'cpm') {
    wrapCost?.classList.remove('hidden');
    wrapCpm?.classList.add('hidden');
    wrapImp?.classList.remove('hidden');
  } else if (mode === 'cost') {
    wrapCost?.classList.add('hidden');
    wrapCpm?.classList.remove('hidden');
    wrapImp?.classList.remove('hidden');
  } else if (mode === 'impressions') {
    wrapCost?.classList.remove('hidden');
    wrapCpm?.classList.remove('hidden');
    wrapImp?.classList.add('hidden');
  }

  resetOutput();
}

function calculate() {
  const costVal = parseFloat(document.getElementById('input-cost')?.value) || 0;
  const cpmVal = parseFloat(document.getElementById('input-cpm')?.value) || 0;
  const impVal = parseFloat(document.getElementById('input-impressions')?.value) || 0;

  const outputTitle = document.getElementById('output-title');
  const outputValue = document.getElementById('output-value');
  const outputSubtext = document.getElementById('output-subtext');
  const outputBreakdown = document.getElementById('output-breakdown');

  if (currentMode === 'cpm') {
    if (impVal > 0) {
      const calculatedCPM = (costVal / impVal) * 1000;
      if (outputTitle) outputTitle.innerText = 'CALCULATED CPM RATE';
      if (outputValue) outputValue.innerText = `$${calculatedCPM.toFixed(2)}`;
      if (outputSubtext) outputSubtext.innerText = 'Cost Per 1,000 Impressions';
      if (outputBreakdown) {
        outputBreakdown.innerText = `CPM = ($${costVal.toLocaleString()} ÷ ${impVal.toLocaleString()}) × 1,000 = $${calculatedCPM.toFixed(2)}`;
      }
    } else {
      if (outputValue) outputValue.innerText = '$0.00';
      if (outputBreakdown) outputBreakdown.innerText = 'Please enter valid ad impressions';
    }
  } else if (currentMode === 'cost') {
    if (impVal > 0 && cpmVal > 0) {
      const calculatedCost = (cpmVal * impVal) / 1000;
      if (outputTitle) outputTitle.innerText = 'REQUIRED AD SPEND';
      if (outputValue) outputValue.innerText = `$${calculatedCost.toFixed(2)}`;
      if (outputSubtext) outputSubtext.innerText = 'Total Budget Required';
      if (outputBreakdown) {
        outputBreakdown.innerText = `Spend = ($${cpmVal} × ${impVal.toLocaleString()}) ÷ 1,000 = $${calculatedCost.toFixed(2)}`;
      }
    } else {
      if (outputValue) outputValue.innerText = '$0.00';
      if (outputBreakdown) outputBreakdown.innerText = 'Please enter valid CPM and impressions';
    }
  } else if (currentMode === 'impressions') {
    if (cpmVal > 0 && costVal > 0) {
      const calculatedImp = (costVal / cpmVal) * 1000;
      if (outputTitle) outputTitle.innerText = 'ESTIMATED IMPRESSIONS';
      if (outputValue) outputValue.innerText = `${Math.round(calculatedImp).toLocaleString()}`;
      if (outputSubtext) outputSubtext.innerText = 'Total Ad Views Delivered';
      if (outputBreakdown) {
        outputBreakdown.innerText = `Views = ($${costVal.toLocaleString()} ÷ $${cpmVal}) × 1,000 = ${Math.round(calculatedImp).toLocaleString()}`;
      }
    } else {
      if (outputValue) outputValue.innerText = '0';
      if (outputBreakdown) outputBreakdown.innerText = 'Please enter valid spend and CPM';
    }
  }
}

function resetCalculator() {
  const inputCost = document.getElementById('input-cost');
  const inputCpm = document.getElementById('input-cpm');
  const inputImp = document.getElementById('input-impressions');

  if (inputCost) inputCost.value = '';
  if (inputCpm) inputCpm.value = '';
  if (inputImp) inputImp.value = '';

  resetOutput();
}

function resetOutput() {
  const outputTitle = document.getElementById('output-title');
  const outputValue = document.getElementById('output-value');
  const outputSubtext = document.getElementById('output-subtext');
  const outputBreakdown = document.getElementById('output-breakdown');

  if (currentMode === 'cpm') {
    if (outputTitle) outputTitle.innerText = 'CALCULATED CPM RATE';
    if (outputValue) outputValue.innerText = '$0.00';
    if (outputSubtext) outputSubtext.innerText = 'Cost Per 1,000 Impressions';
    if (outputBreakdown) outputBreakdown.innerText = 'CPM = ($0 ÷ 0) × 1,000 = $0.00';
  } else if (currentMode === 'cost') {
    if (outputTitle) outputTitle.innerText = 'REQUIRED AD SPEND';
    if (outputValue) outputValue.innerText = '$0.00';
    if (outputSubtext) outputSubtext.innerText = 'Total Budget Required';
    if (outputBreakdown) outputBreakdown.innerText = 'Spend = ($0 × 0) ÷ 1,000 = $0.00';
  } else if (currentMode === 'impressions') {
    if (outputTitle) outputTitle.innerText = 'ESTIMATED IMPRESSIONS';
    if (outputValue) outputValue.innerText = '0';
    if (outputSubtext) outputSubtext.innerText = 'Total Ad Views Delivered';
    if (outputBreakdown) outputBreakdown.innerText = 'Views = ($0 ÷ $0) × 1,000 = 0';
  }
}