// Waitlist form. Progressive enhancement: without JS the form posts to the
// same endpoint and gets a plain confirmation page back.
(function () {
  var form = document.querySelector('[data-waitlist]');
  if (!form || !window.fetch) return;

  var msg = document.querySelector('[data-waitlist-msg]');
  var btn = form.querySelector('button');
  var busy = false;

  function say(text, isError) {
    if (!msg) return;
    msg.textContent = text;
    msg.classList.toggle('is-error', !!isError);
    msg.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    if (busy) { e.preventDefault(); return; }
    if (typeof form.checkValidity === 'function' && !form.checkValidity()) return;

    e.preventDefault();
    busy = true;
    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending';
    if (msg) msg.hidden = true;

    var fd = new FormData(form);
    var body = {};
    fd.forEach(function (v, k) { body[k] = String(v).trim(); });

    fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (!r.ok) throw new Error(d.error || 'Something went wrong. Try again.');
        return d;
      });
    }).then(function (d) {
      form.hidden = true;
      say(d.message || 'You are on the list.', false);
    }).catch(function (err) {
      say(err.message || 'Something went wrong. Try again.', true);
      busy = false;
      btn.disabled = false;
      btn.textContent = label;
    });
  });
})();
