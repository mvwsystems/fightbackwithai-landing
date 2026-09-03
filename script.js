// Scroll-reveal only. No dependencies.
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  els.forEach(function (el) { io.observe(el); });
})();

// Signup. Progressive enhancement over the form's hosted-page fallback.
(function () {
  var form = document.querySelector('[data-subscribe]');
  if (!form || !window.fetch) return;

  var msg = document.querySelector('[data-subscribe-msg]');
  var input = form.querySelector('input[type=email]');
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
    // Let the browser show its own validation, and fall through to the
    // hosted page if anything here is unavailable.
    if (typeof form.checkValidity === 'function' && !form.checkValidity()) return;

    e.preventDefault();
    busy = true;
    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending';
    if (msg) msg.hidden = true;

    fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: input.value.trim() })
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (!r.ok) throw new Error(d.error || 'Something went wrong. Try again.');
        return d;
      });
    }).then(function (d) {
      form.reset();
      say(d.status === 'active'
        ? 'You are in. The next issue lands in your inbox.'
        : 'Almost there. Check your inbox to confirm.', false);
    }).catch(function (err) {
      say(err.message || 'Something went wrong. Try again.', true);
    }).then(function () {
      busy = false;
      btn.disabled = false;
      btn.textContent = label;
    });
  });
})();
