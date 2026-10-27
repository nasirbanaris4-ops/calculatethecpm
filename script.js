// Dynamic Currency State
let currentCurrencySymbol = "$";

function updateCurrency() {
  const selectElement = document.getElementById("currency-select");
  if (selectElement) {
    currentCurrencySymbol = selectElement.value;
  }
  calculate();
}

// Helper to get raw numeric values safely regardless of $, spaces, or symbols
function getCleanNumber(elementId) {
  const el = document.getElementById(elementId);
  if (!el || !el.value) return 0;
  const cleanVal = el.value.toString().replace(/[^0-9.]/g, '');
  return parseFloat(cleanVal) || 0;
}

// Mode Switcher Logic
let currentMode = 'cpm';

function switchMode(mode) {
  currentMode = mode;
  
  const tabs = ['cpm', 'spend', 'views'];
  tabs.forEach(tab => {
    const btn = document.getElementById(`tab-${tab}`);
    if (btn) {
      if (tab === mode) {
        btn.className = "px-4 py-2 text-xs font-bold rounded-xl bg-emerald-700 text-white shadow-sm transition";
      } else {
        btn.className = "px-4 py-2 text-xs font-bold rounded-xl text-slate-600 hover:bg-slate-100 transition";
      }
    }
  });

  const input1Label = document.getElementById("label-input1");
  const input2Label = document.getElementById("label-input2");
  const resultTitle = document.getElementById("result-title");
  const resultSubtext = document.getElementById("result-subtext");

  if (mode === 'cpm') {
    if (input1Label) input1Label.innerText = "TOTAL CAMPAIGN AD SPEND";
    if (input2Label) input2Label.innerText = "TOTAL CAMPAIGN AD IMPRESSIONS";
    if (resultTitle) resultTitle.innerText = "CALCULATED CPM RATE";
    if (resultSubtext) resultSubtext.innerText = "Cost Per 1,000 Impressions";
  } else if (mode === 'spend') {
    if (input1Label) input1Label.innerText = "TARGET CPM RATE";
    if (input2Label) input2Label.innerText = "TOTAL CAMPAIGN AD IMPRESSIONS";
    if (resultTitle) resultTitle.innerText = "ESTIMATED TOTAL SPEND";
    if (resultSubtext) resultSubtext.innerText = "Total Required Budget";
  } else if (mode === 'views') {
    if (input1Label) input1Label.innerText = "TOTAL CAMPAIGN AD SPEND";
    if (input2Label) input2Label.innerText = "TARGET CPM RATE";
    if (resultTitle) resultTitle.innerText = "ESTIMATED IMPRESSIONS";
    if (resultSubtext) resultSubtext.innerText = "Total Expected Views/Impressions";
  }

  calculate();
}

// Main Calculation Logic
function calculate() {
  const outputDisplay = document.getElementById("output-result");
  const breakdownDisplay = document.getElementById("breakdown-text");

  if (!outputDisplay) return;

  const val1 = getCleanNumber("input1");
  const val2 = getCleanNumber("input2");

  if (val1 <= 0 || val2 <= 0) {
    outputDisplay.innerText = currentMode === 'views' ? "0" : `${currentCurrencySymbol}0.00`;
    if (breakdownDisplay) {
      breakdownDisplay.innerText = `${currentMode.toUpperCase()} = (${currentCurrencySymbol}0 ÷ 0) × 1,000 = ${currentCurrencySymbol}0.00`;
    }
    return;
  }

  let result = 0;

  if (currentMode === 'cpm') {
    result = (val1 / val2) * 1000;
    outputDisplay.innerText = `${currentCurrencySymbol}${result.toFixed(2)}`;
    if (breakdownDisplay) {
      breakdownDisplay.innerText = `CPM = (${currentCurrencySymbol}${val1} ÷ ${val2.toLocaleString()}) × 1,000 = ${currentCurrencySymbol}${result.toFixed(2)}`;
    }
  } else if (currentMode === 'spend') {
    result = (val1 * val2) / 1000;
    outputDisplay.innerText = `${currentCurrencySymbol}${result.toFixed(2)}`;
    if (breakdownDisplay) {
      breakdownDisplay.innerText = `Spend = (${currentCurrencySymbol}${val1} × ${val2.toLocaleString()}) ÷ 1,000 = ${currentCurrencySymbol}${result.toFixed(2)}`;
    }
  } else if (currentMode === 'views') {
    result = (val1 / val2) * 1000;
    outputDisplay.innerText = Math.round(result).toLocaleString();
    if (breakdownDisplay) {
      breakdownDisplay.innerText = `Impressions = (${currentCurrencySymbol}${val1} ÷ ${currentCurrencySymbol}${val2}) × 1,000 = ${Math.round(result).toLocaleString()}`;
    }
  }
}

// Auto attach live calculations on document setup
document.addEventListener("DOMContentLoaded", () => {
  const input1 = document.getElementById("input1");
  const input2 = document.getElementById("input2");

  if (input1) {
    input1.addEventListener("input", calculate);
    input1.addEventListener("keyup", calculate);
  }
  if (input2) {
    input2.addEventListener("input", calculate);
    input2.addEventListener("keyup", calculate);
  }
});