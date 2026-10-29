(() => {
 'use strict';
 const form = document.querySelector('#contact-form');
 if (!form) return;
 const button = form.querySelector('button[type="submit"]');
 const label = document.querySelector('#send-label');
 const spinner = form.querySelector('.send-spinner');
 const status = document.querySelector('#contact-status');
 let sending = false;
 let sent = false;
 let editedWhileSending = false;
 form.addEventListener('input', () => {
  if (sending) editedWhileSending = true;
  if (sent) {
   sent = false;
   label.textContent = 'Send message';
   status.textContent = '';
  }
 });
 form.addEventListener('submit', async event => {
  event.preventDefault();
  if (sending || !form.reportValidity()) return;
  if (form.elements.botcheck.checked) return;
  const payload = JSON.stringify(Object.fromEntries(new FormData(form)));
  sending = true;
  editedWhileSending = false;
  form.setAttribute('aria-busy', 'true');
  label.textContent = 'Sending…';
  spinner.hidden = false;
  status.className = 'contact-status';
  status.textContent = 'Sending your message…';
  const controller = new AbortController();
  const slowTimer = setTimeout(() => {
   status.textContent = 'Taking a little longer. Please wait…';
  }, 8000);
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
   const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST', headers: {'Content-Type':'application/json', Accept:'application/json'},
    body: payload, signal: controller.signal
   });
   if (!response.ok) throw new Error('unconfirmed');
   const result = await response.json();
   if (!(result.success === true || result.success === 'true')) throw new Error('unconfirmed');
   sent = true;
   if (!editedWhileSending) form.reset();
   label.textContent = 'Sent ✓';
   status.className = 'contact-status success';
   status.textContent = editedWhileSending
    ? 'Your original message was submitted. Your latest edits are still here.'
    : 'Thank you. Your message has been submitted.';
  } catch (error) {
   status.className = 'contact-status error';
   label.textContent = 'Send message';
   status.textContent = 'Submission could not be confirmed. Your message is still in the form.';
   const emailLink = document.createElement('a');
   emailLink.href = 'mailto:support@calculatethecpm.net';
   emailLink.textContent = 'Email support instead';
   status.append(' ', emailLink, '.');
  } finally {
   clearTimeout(timer);
   clearTimeout(slowTimer);
   sending = false;
   button.disabled = false;
   form.removeAttribute('aria-busy');
   spinner.hidden = true;
   status.focus();
  }
 });
})();


