document.addEventListener('DOMContentLoaded', () => {
  // Inject Dynamic JSON-LD Schema for SEO, AEO & GEO
  injectJSONLDSchema();

  // Tabs Elements
  const tabCPM = document.getElementById('tab-cpm');
  const tabSpend = document.getElementById('tab-spend');
  const tabImpressions = document.getElementById('tab-impressions');

  // Input Fields Containers
  const fieldCost = document.getElementById('field-cost');
  const fieldImpressions = document.getElementById('field-impressions');
  const fieldCPM = document.getElementById('field-cpm');

  // Inputs
  const costInput = document.getElementById('cost');
  const impressionsInput = document.getElementById('impressions');
  const cpmInput = document.getElementById('cpm-rate');
  const currencySelect = document.getElementById('currency');
  const resetBtn = document.getElementById('reset-btn');

  // Outputs
  const resultTitle = document.getElementById('result-title');
  const resultVal = document.getElementById('result-val');
  const resultLbl = document.getElementById('result-lbl');
  const formulaText = document.getElementById('formula-text');

  let currentMode = 'CPM'; // Default mode: CPM, SPEND, IMPRESSIONS
  let currencySymbol = '$';

  // Currency Symbols Mapping
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    PKR: 'Rs '
  };

  if (currencySelect) {
    currencySelect.addEventListener('change', (e) => {
      currencySymbol = currencySymbols[e.target.value] || '$';
      calculate();
    });
  }

  // Active/Inactive Tab Styling Function
  function setActiveTab(activeTab, inactiveTab1, inactiveTab2) {
    if (!activeTab) return;
    activeTab.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white shadow-sm transition cursor-pointer";
    inactiveTab1.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-white text-slate-600 hover:bg-slate-200 transition cursor-pointer";
    inactiveTab2.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-white text-slate-600 hover:bg-slate-200 transition cursor-pointer";
  }

  // Tab Switch Event Listeners
  if (tabCPM) {
    tabCPM.addEventListener('click', () => {
      currentMode = 'CPM';
      setActiveTab(tabCPM, tabSpend, tabImpressions);
      if (fieldCost) fieldCost.classList.remove('hidden');
      if (fieldImpressions) fieldImpressions.classList.remove('hidden');
      if (fieldCPM) fieldCPM.classList.add('hidden');
      calculate();
    });
  }

  if (tabSpend) {
    tabSpend.addEventListener('click', () => {
      currentMode = 'SPEND';
      setActiveTab(tabSpend, tabCPM, tabImpressions);
      if (fieldCost) fieldCost.classList.add('hidden');
      if (fieldImpressions) fieldImpressions.classList.remove('hidden');
      if (fieldCPM) fieldCPM.classList.remove('hidden');
      calculate();
    });
  }

  if (tabImpressions) {
    tabImpressions.addEventListener('click', () => {
      currentMode = 'IMPRESSIONS';
      setActiveTab(tabImpressions, tabCPM, tabSpend);
      if (fieldCost) fieldCost.classList.remove('hidden');
      if (fieldImpressions) fieldImpressions.classList.add('hidden');
      if (fieldCPM) fieldCPM.classList.remove('hidden');
      calculate();
    });
  }

  // Main Dynamic Calculation Function
  function calculate() {
    const cost = parseFloat(costInput ? costInput.value : 0) || 0;
    const impressions = parseFloat(impressionsInput ? impressionsInput.value : 0) || 0;
    const cpm = parseFloat(cpmInput ? cpmInput.value : 0) || 0;

    if (currentMode === 'CPM') {
      if (resultTitle) resultTitle.innerText = "CALCULATED CPM RATE";
      if (resultLbl) resultLbl.innerText = "Cost Per 1,000 Impressions";
      
      if (impressions > 0) {
        const calculatedCPM = (cost / impressions) * 1000;
        if (resultVal) resultVal.innerText = `${currencySymbol}${calculatedCPM.toFixed(2)}`;
        if (formulaText) formulaText.innerText = `CPM = (${currencySymbol}${cost.toLocaleString()} ÷ ${impressions.toLocaleString()}) × 1,000 = ${currencySymbol}${calculatedCPM.toFixed(2)}`;
      } else {
        if (resultVal) resultVal.innerText = `${currencySymbol}0.00`;
        if (formulaText) formulaText.innerText = `CPM = Enter valid numbers`;
      }
    } 
    else if (currentMode === 'SPEND') {
      if (resultTitle) resultTitle.innerText = "ESTIMATED CAMPAIGN SPEND";
      if (resultLbl) resultLbl.innerText = "Total Required Budget";

      const calculatedSpend = (cpm * impressions) / 1000;
      if (resultVal) resultVal.innerText = `${currencySymbol}${calculatedSpend.toFixed(2)}`;
      if (formulaText) formulaText.innerText = `Cost = (${currencySymbol}${cpm.toFixed(2)} × ${impressions.toLocaleString()}) ÷ 1,000 = ${currencySymbol}${calculatedSpend.toFixed(2)}`;
    } 
    else if (currentMode === 'IMPRESSIONS') {
      if (resultTitle) resultTitle.innerText = "REQUIRED AD IMPRESSIONS";
      if (resultLbl) resultLbl.innerText = "Target Impression Reach";

      if (cpm > 0) {
        const calculatedImpressions = (cost / cpm) * 1000;
        if (resultVal) resultVal.innerText = Math.round(calculatedImpressions).toLocaleString();
        if (formulaText) formulaText.innerText = `Impressions = (${currencySymbol}${cost.toLocaleString()} ÷ ${currencySymbol}${cpm.toFixed(2)}) × 1,000 = ${Math.round(calculatedImpressions).toLocaleString()}`;
      } else {
        if (resultVal) resultVal.innerText = "0";
        if (formulaText) formulaText.innerText = `Impressions = Enter valid numbers`;
      }
    }
  }

  // Live Real-Time Input Triggers
  [costInput, impressionsInput, cpmInput].forEach(input => {
    if (input) {
      input.addEventListener('input', calculate);
    }
  });

  // Reset Button Logic
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (costInput) costInput.value = "1000";
      if (impressionsInput) impressionsInput.value = "200000";
      if (cpmInput) cpmInput.value = "5.00";
      calculate();
    });
  }

  // Initial Calculation Run
  calculate();

  // Function to Automatically Inject JSON-LD Schema
  function injectJSONLDSchema() {
    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "name": "CPM Calculator Utility",
          "operatingSystem": "All",
          "applicationCategory": "BusinessApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "description": "Free online advertising Cost Per Mille (CPM) calculator to measure campaign efficiency across Google, YouTube, Meta, and TikTok."
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is a good CPM rate?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A good CPM depends on target geography and industry niche. General display campaigns aim for $2.00–$5.00 CPM, while high-intent B2B or finance segments in Tier-1 countries can reach $30.00+."
              }
            },
            {
              "@type": "Question",
              "name": "What is the difference between CPM and CPC?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "CPM charges per 1,000 ad views regardless of interactions, whereas CPC charges only when a user clicks your ad."
              }
            }
          ]
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);
  }
});