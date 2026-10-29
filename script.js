/* Shared calculator engine. Currency is a unit, not an exchange-rate conversion. */
(function () {
  'use strict';
  const form = document.getElementById('calculator');
  if (!form) return;
  const type = form.dataset.metric;
  const definitions = {
    cpm: { fields: ['spend', 'impressions', 'rate'], labels: ['Ad spend', 'Ad impressions', 'CPM'], factor: 1000 },
    ecpm: { fields: ['revenue', 'impressions', 'rate'], labels: ['Ad revenue', 'Ad impressions', 'eCPM'], factor: 1000 },
    cpc: { fields: ['spend', 'clicks', 'rate'], labels: ['Ad spend', 'Clicks', 'CPC'], factor: 1 },
    ctr: { fields: ['clicks', 'impressions', 'rate'], labels: ['Clicks', 'Ad impressions', 'CTR (%)'], factor: 100 },
    roas: { fields: ['revenue', 'spend', 'rate'], labels: ['Attributed revenue', 'Ad spend', 'ROAS (multiple)'], factor: 1 },
    conversion: { fields: ['cpc', 'ctr', 'cpm'], labels: ['CPC', 'CTR (%)', 'CPM'], factor: 10 }
  };
  const definition = definitions[type];
  if (!definition) return;
  const { fields, labels, factor } = definition;
  const mode = document.getElementById('solve-for');
  const currency = document.getElementById('currency');
  const tabs = [...document.querySelectorAll('[data-solve]')];
  const result = document.getElementById('output-value');
  const breakdown = document.getElementById('output-breakdown');
  const message = document.getElementById('input-error');
  const moneyFields = type === 'ctr' ? [] : type === 'conversion' ? ['cpc', 'cpm'] : type === 'roas' ? ['revenue', 'spend'] : [fields[0], 'rate'];
  const number = value => value.toLocaleString('en-US', { maximumFractionDigits: 4 });
  const format = (value, field) => moneyFields.includes(field)
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.value, minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(value)
    : number(value) + (field === 'ctr' || (type === 'ctr' && field === 'rate') ? '%' : type === 'roas' && field === 'rate' ? 'x' : '');
  function clear() {
    result.textContent = '—';
    breakdown.textContent = 'Enter the two known values to see the calculation.';
    message.textContent = '';
    fields.forEach(field => document.getElementById('input-' + field).removeAttribute('aria-invalid'));
  }
  function calculate(explicit = false) {
    clear();
    const target = fields.indexOf(mode.value);
    const values = fields.map(field => {
      const input = document.getElementById('input-' + field);
      return input.value.trim() === '' ? NaN : Number(input.value);
    });
    const known = values.filter((_, index) => index !== target);
    if (known.some(value => !Number.isFinite(value))) {
      if (explicit) message.textContent = 'Enter both known values as numbers.';
      return;
    }
    if (known.some(value => value < 0)) {
      message.textContent = 'Values must be zero or greater.';
      fields.forEach((field, index) => { if (index !== target && values[index] < 0) document.getElementById('input-' + field).setAttribute('aria-invalid', 'true'); });
      return;
    }
    const [a, b, c] = values;
    // Standard relation: c = a / b * factor. Conversion: c = a * b * 10.
    const denominator = type === 'conversion' ? (target === 0 ? b : target === 1 ? a : 1) : target === 0 ? factor : target === 1 ? c : b;
    if (denominator === 0) {
      message.textContent = 'The divisor must be greater than zero. This combination has no unique result.';
      return;
    }
    const value = type === 'conversion'
      ? target === 2 ? a * b * factor : target === 0 ? c / (b * factor) : c / (a * factor)
      : target === 2 ? a / b * factor : target === 0 ? c * b / factor : a / c * factor;
    if (!Number.isFinite(value)) { message.textContent = 'These values are too large. Try smaller numbers.'; return; }
    result.textContent = format(value, fields[target]);
    const formula = type === 'conversion'
      ? target === 2 ? `${format(a, fields[0])} × ${number(b)} × 10` : target === 0 ? `${format(c, fields[2])} ÷ (${number(b)} × 10)` : `${format(c, fields[2])} ÷ (${format(a, fields[0])} × 10)`
      : target === 2 ? `(${format(a, fields[0])} ÷ ${format(b, fields[1])}) × ${factor}` : target === 0 ? `(${format(c, fields[2])} × ${format(b, fields[1])}) ÷ ${factor}` : `(${format(a, fields[0])} ÷ ${format(c, fields[2])}) × ${factor}`;
    breakdown.textContent = `${labels[target]} = ${formula} = ${format(value, fields[target])}`;
  }
  function switchMode() {
    tabs.forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.solve === mode.value)));
    fields.forEach(field => {
      const input = document.getElementById('input-' + field);
      const hidden = field === mode.value;
      input.disabled = hidden;
      input.closest('.field').hidden = hidden;
    });
    document.getElementById('output-title').textContent = labels[fields.indexOf(mode.value)];
    calculate();
  }
  form.addEventListener('submit', event => { event.preventDefault(); calculate(true); });
  form.addEventListener('input', event => { if (event.target !== mode && event.target !== currency) calculate(); });
  mode.addEventListener('change', switchMode);
  tabs.forEach(tab => tab.addEventListener('click', () => { mode.value = tab.dataset.solve; switchMode(); }));
  let currencyChosen = false;
  currency.addEventListener('change', () => { currencyChosen = true; });
  currency.addEventListener('change', () => calculate());
  document.getElementById('reset-inputs').addEventListener('click', () => {
    fields.forEach(field => { document.getElementById('input-' + field).value = ''; });
    clear();
    document.querySelector('.field:not([hidden]) input').focus();
  });
  switchMode();
  if (type !== 'ctr' && location.protocol === 'https:') {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    fetch('/cdn-cgi/trace', {signal:controller.signal, cache:'no-store', credentials:'omit'})
      .then(r => r.ok ? r.text() : '')
      .then(text => {
        if (currencyChosen) return;
        const country = text.match(/^loc=([A-Z]{2})$/m)?.[1];
        const map = {US:'USD',GB:'GBP',CA:'CAD',AU:'AUD',IN:'INR',PK:'PKR',AE:'AED',SA:'SAR',JP:'JPY'};
        const euro = ['AT','BE','HR','CY','EE','FI','FR','DE','GR','IE','IT','LV','LT','LU','MT','NL','PT','SK','SI','ES','BG'];
        currency.value = map[country] || (euro.includes(country) ? 'EUR' : 'USD');
        calculate();
      }).catch(() => {}).finally(() => clearTimeout(timeout));
  }
}());
