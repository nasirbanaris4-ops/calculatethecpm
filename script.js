// Global Currency State
let currentCurrencySymbol = "$";

// Function to update currency symbol on dropdown change
function updateCurrency() {
  const selectElement = document.getElementById("currency-select");
  if (selectElement) {
    currentCurrencySymbol = selectElement.value;
  }
  // Trigger calculation refresh if inputs are filled
  calculate();
}

// Mode Switcher Logic (CPM, Spend, Views)
let currentMode = 'cpm';

function switchMode(mode) {
  currentMode = mode;
  
  // Tab Styling Updates
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

  // Dynamic Input Labels
  const input1Label = document.getElementById("label-input1");
  const input2Label = document.getElementById("label-input2");
  const resultTitle = document.getElementById("result-title");
  const resultSubtext = document.getElementById("result-subtext");

  if (mode === 'cpm') {
    if (input1Label) input1Label.innerText = "TOTAL CAMPAIGN SPEND";
    if (input2Label) input2Label.innerText = "TOTAL IMPRESSIONS / VIEWS";
    if (resultTitle) resultTitle.innerText = "CALCULATED CPM RATE";
    if (resultSubtext) resultSubtext.innerText = "Cost Per 1,000 Impressions";
  } else if (mode === 'spend') {
    if (input1Label) input1Label.innerText = "TARGET CPM RATE";
    if (input2Label) input2Label.innerText = "TOTAL IMPRESSIONS / VIEWS";
    if (resultTitle) resultTitle.innerText = "ESTIMATED TOTAL SPEND";
    if (resultSubtext) resultSubtext.innerText = "Total Required Budget";
  } else if (mode === 'views') {
    if (input1Label) input1Label.innerText = "TOTAL CAMPAIGN SPEND";
    if (input2Label) input2Label.innerText = "TARGET CPM RATE";
    if (resultTitle) resultTitle.innerText = "ESTIMATED IMPRESSIONS";
    if (resultSubtext) resultSubtext.innerText = "Total Expected Views/Impressions";
  }

  // Clear or Recalculate
  calculate();
}

// Main Calculator Logic
function calculate() {
  const input1Val = parseFloat(document.getElementById("input1")?.value) || 0;
  const input2Val = parseFloat(document.getElementById("input2")?.value) || 0;
  const outputDisplay = document.getElementById("output-result");

  if (!outputDisplay) return;

  if (input1Val <= 0 || input2Val <= 0) {
    outputDisplay.innerText = currentMode === 'views' ? "0" : `${currentCurrencySymbol}0.00`;
    return;
  }

  let result = 0;

  if (currentMode === 'cpm') {
    // CPM = (Spend / Impressions) * 1000
    result = (input1Val / input2Val) * 1000;
    outputDisplay.innerText = `${currentCurrencySymbol}${result.toFixed(2)}`;
  } else if (currentMode === 'spend') {
    // Total Spend = (CPM * Impressions) / 1000
    result = (input1Val * input2Val) / 1000;
    outputDisplay.innerText = `${currentCurrencySymbol}${result.toFixed(2)}`;
  } else if (currentMode === 'views') {
    // Impressions = (Total Spend / CPM) * 1000
    result = (input1Val / input2Val) * 1000;
    outputDisplay.innerText = Math.round(result).toLocaleString();
  }
}

// Reset Function
function resetInputs() {
  const input1 = document.getElementById("input1");
  const input2 = document.getElementById("input2");
  const outputDisplay = document.getElementById("output-result");

  if (input1) input1.value = "";
  if (input2) input2.value = "";
  if (outputDisplay) {
    outputDisplay.innerText = currentMode === 'views' ? "0" : `${currentCurrencySymbol}0.00`;
  }
}