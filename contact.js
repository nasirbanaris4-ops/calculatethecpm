(() => {
 'use strict';
 const form = document.querySelector('#contact-form');
 if (!form) return;
 const button = form.querySelector('button[type="submit"]');
 const label = document.querySelector('#send-label');
 const spinner = form.querySelector('.send-spinner');
 const status = document.querySelector('#contact-status');
 let sending = false;
 form.addEventListener('submit', async event => {
  event.preventDefault();
  if (sending || !form.reportValidity()) return;
  if (form.elements._honey.value) return;
  const payload = Object.fromEntries(new FormData(form));
  sending = true;
  button.disabled = true;
  form.setAttribute('aria-busy', 'true');
  label.textContent = 'Sending…';
  spinner.hidden = false;
  status.className = 'contact-status';
  status.textContent = 'Sending your message…';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
   const response = await fetch('https://formsubmit.co/ajax/support@calculatethecpm.net', {
    method: 'POST', headers: {'Content-Type':'application/json', Accept:'application/json'},
    body: JSON.stringify(payload), signal: controller.signal
   });
   const result = await response.json();
   if (!response.ok || !(result.success === true || result.success === 'true')) throw new Error('unconfirmed');
   if (/activat|confirm.*email|check.*email/i.test(result.message || '')) throw new Error('activation');
   form.reset();
   status.className = 'contact-status success';
   status.textContent = 'Thank you. Your message has been submitted.';
  } catch (error) {
   status.className = 'contact-status error';
   status.textContent = error.message === 'activation'
    ? 'The form is not ready yet. Please email support@calculatethecpm.net directly.'
    : 'We could not confirm your submission. Your message is still here. Please email support@calculatethecpm.net, or try again later.';
  } finally {
   clearTimeout(timer);
   sending = false;
   button.disabled = false;
   form.removeAttribute('aria-busy');
   label.textContent = 'Send message';
   spinner.hidden = true;
   status.focus();
  }
 });
})();
