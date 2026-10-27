let currentMode = 'cpm';

function switchMode(mode) {
  currentMode = mode;

  const btnCpm = document.getElementById('tab-cpm');
  const btnCost = document.getElementById('tab-cost');
  const btnImp = document.getElementById('tab-impressions');

  const activeClass = 'px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 text-white transition';
  const inactiveClass = 'px-4 py-2 text-xs font-bold rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition';

  if (btnCpm) btnCpm.className = (mode === 'cpm') ? activeClass : inactiveClass;
  if (btnCost) btnCost.className = (mode === 'cost') ? activeClass : inactiveClass;
  if (btnImp) btnImp.className = (mode === 'impressions') ? activeClass : inactiveClass;

  const costField = document.getElementById('field-cost');
  const cpmField = document.getElementById('field-cpm');
  const impField = document.getElementById('field-impressions');

  if (mode === 'cpm') {
    costField?.classList.remove('hidden');
    cpmField?.classList.add('hidden');
    impField?.classList.remove('hidden');
  } else if (mode === 'cost') {
    costField?.classList.add('hidden');
    cpmField?.classList.remove('hidden');
    impField?.classList.remove('hidden');
  } else if (mode === 'impressions') {
    costField?.classList.remove('hidden');
    cpmField?.classList.remove('hidden');
    impField?.classList.add('hidden');
  }

  document.getElementById('result-box')?.classList.add('hidden');
}

function calculate() {
  const costInput = document.getElementById('cost');
  const cpmInput = document.getElementById('cpm');
  const impInput = document.getElementById('impressions');

  const cost = parseFloat(costInput?.value) || 0;
  const cpm = parseFloat(cpmInput?.value) || 0;
  const impressions = parseFloat(impInput?.value) || 0;

  const resultBox = document.getElementById('result-box');
  const resultText = document.getElementById('result-text');

  let output = '';

  if (currentMode === 'cpm') {
    if (impressions > 0) {
      const calculatedCPM = (cost / impressions) * 1000;
      output = `CPM = $${calculatedCPM.toFixed(2)}`;
    } else {
      output = 'Please enter valid ad impressions';
    }
  } else if (currentMode === 'cost') {
    if (impressions > 0 && cpm > 0) {
      const calculatedCost = (cpm * impressions) / 1000;
      output = `Total Cost = $${calculatedCost.toFixed(2)}`;
    } else {
      output = 'Please enter valid CPM and impressions';
    }
  } else if (currentMode === 'impressions') {
    if (cpm > 0 && cost > 0) {
      const calculatedImp = (cost / cpm) * 1000;
      output = `Required Impressions = ${Math.round(calculatedImp).toLocaleString()}`;
    } else {
      output = 'Please enter valid cost and CPM';
    }
  }

  if (resultText && resultBox) {
    resultText.innerText = output;
    resultBox.classList.remove('hidden');
  }
}
