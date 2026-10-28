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
 form.addEventListener('input', () => {
  if (sent) {
   sent = false;
   label.textContent = 'Send message';
   status.textContent = '';
  }
 });
 form.addEventListener('submit', async event => {
  event.preventDefault();
  if (sending || !form.reportValidity()) return;
  if (form.elements._honey.value) return;
  const payload = new URLSearchParams(new FormData(form));
  sending = true;
  form.setAttribute('aria-busy', 'true');
  label.textContent = 'Sending…';
  spinner.hidden = false;
  status.className = 'contact-status';
  status.textContent = 'Sending your message…';
  const controller = new AbortController();
  const slowTimer = setTimeout(() => {
   status.textContent = 'Still sending. Please wait—there is no need to submit again.';
  }, 15000);
  const timer = setTimeout(() => controller.abort(), 60000);
  try {
   const response = await fetch('https://formsubmit.co/ajax/support@calculatethecpm.net', {
    method: 'POST', headers: {Accept:'application/json'},
    body: payload, signal: controller.signal
   });
   const result = await response.json();
   if (!response.ok || !(result.success === true || result.success === 'true')) throw new Error('unconfirmed');
   sent = true;
   form.reset();
   label.textContent = 'Sent ✓';
   status.className = 'contact-status success';
   status.textContent = 'Thank you. Your message has been submitted.';
  } catch (error) {
   status.className = 'contact-status error';
   label.textContent = 'Try again';
   status.textContent = 'We could not confirm delivery. If the message has already arrived, please do not resend it. You can also email support@calculatethecpm.net.';
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
