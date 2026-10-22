/* Francis Jr G. Viola - site scripts */
(function () {
  // Footer year
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // Close the mobile menu after tapping a link
  document.querySelectorAll('#navmenu .nav-link').forEach(function (a) {
    a.addEventListener('click', function () {
      var el = document.getElementById('header');
      var oc = window.bootstrap && bootstrap.Offcanvas.getInstance(el);
      if (oc) oc.hide();
    });
  });

  // Skill bars animate when visible (home page)
  var row = document.getElementById('skillsRow');
  if (row) {
    var fill = function () {
      row.querySelectorAll('.progress-bar').forEach(function (b) { b.style.width = b.getAttribute('data-w') + '%'; });
    };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { fill(); io.disconnect(); } }, { threshold: 0.2 });
      io.observe(row);
    } else { fill(); }
  }

  // Contact form (contact page)
  var form = document.getElementById('contactForm');
  if (form) {
    var status = document.getElementById('formStatus');
    var RECEIVER = 'franciscoviola2025@gmail.com';

    function show(type, msg) {
      status.className = 'alert alert-' + type + ' mt-3';
      status.textContent = msg;
      status.classList.remove('d-none');
    }

    // Fallback: open the visitor's email app with the message filled in
    function mailtoFallback(d) {
      var body = 'Name: ' + d.get('name') + '\nEmail: ' + d.get('email') + '\nPhone: ' + (d.get('phone') || '-') + '\n\n' + d.get('message');
      window.location.href = 'mailto:' + RECEIVER + '?subject=' + encodeURIComponent(d.get('subject')) + '&body=' + encodeURIComponent(body);
      show('info', 'Opening your email app... if nothing opens, email me directly at ' + RECEIVER + '.');
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
      var data = new FormData(form);
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      show('secondary', 'Sending...');

      // Works only on a host that runs PHP (uses contact.php). Otherwise falls back to email app.
      fetch('contact.php', { method: 'POST', body: data })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j.ok) { form.reset(); form.classList.remove('was-validated'); show('success', 'Thank you! Your message has been sent.'); }
          else { show('danger', j.error || 'Something went wrong. Please try again.'); }
        })
        .catch(function () { mailtoFallback(data); })
        .finally(function () { btn.disabled = false; });
    });
  }
})();
