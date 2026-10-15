// CYTHON CTF — team-only registration (2–4 members), stored in Supabase.
// Students -> student_registrations, professionals -> professional_registrations.
(function () {
  var state = {
    participantType: '', mode: 'team',
    fullName: '', email: '', mobile: '',
    teamName: '', teamSize: 2, members: [],
    payMethod: ''
  };
  var step = 1;
  function panels() { return [1, 2, 3, 4].map(function (n) { return document.getElementById('panel-' + n); }); }
  function err(id, msg) {
    var e = document.getElementById(id);
    if (!e) return !msg;
    e.textContent = msg || '';
    e.classList.toggle('show', !!msg);
    return !msg;
  }
  function esc(s) {
    return String(s || '').replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function show(n) {
    step = n;
    panels().forEach(function (p, i) { if (p) p.hidden = (i + 1) !== n; });
    document.querySelectorAll('.stepper li').forEach(function (li, i) {
      li.classList.toggle('active', (i + 1) === n);
      li.classList.toggle('done', (i + 1) < n);
      li.querySelector('.step-dot').textContent = (i + 1) < n ? '✓' : '0' + (i + 1);
    });
    var names = { 1: 'Participant Details', 2: 'Team Details', 3: 'Payment', 4: 'Confirmation' };
    document.getElementById('stepLive').textContent = 'Step ' + n + ' of 4: ' + names[n];
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (n === 3) renderSummary();
    if (n === 4) renderConfirm();
  }
  function renderMemberFields() {
    var box = document.getElementById('memberFields');
    var html = '';
    for (var i = 2; i <= state.teamSize; i++) {
      var m = state.members[i - 2] || { name: '', email: '' };
      html += '<div class="two"><div class="field"><label for="mname' + i + '">Member ' + i + ' Name<i>*</i></label>'
        + '<input id="mname' + i + '" type="text" placeholder="Teammate name" value="' + esc(m.name) + '">'
        + '<p class="err" id="e-mname' + i + '"></p></div>'
        + '<div class="field"><label for="mmail' + i + '">Member ' + i + ' Email<i>*</i></label>'
        + '<input id="mmail' + i + '" type="email" placeholder="teammate@mail.com" value="' + esc(m.email) + '">'
        + '<p class="err" id="e-mmail' + i + '"></p></div></div>';
    }
    box.innerHTML = html;
  }
  function validEmail(v) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v); }
  function renderSummary() {
    var rows = '<div><dt>Leader</dt><dd>' + esc(state.fullName) + ' (' + esc(state.email) + ')</dd></div>'
      + '<div><dt>Type</dt><dd>' + esc(state.participantType) + '</dd></div>'
      + '<div><dt>Team</dt><dd>' + esc(state.teamName) + ' · ' + state.teamSize + ' members</dd></div>';
    state.members.forEach(function (m, i) {
      rows += '<div><dt>Member ' + (i + 2) + '</dt><dd>' + esc(m.name) + ' (' + esc(m.email) + ')</dd></div>';
    });
    document.getElementById('paySummary').innerHTML = rows;
  }
  function renderConfirm() {
    var rows = '<div><dt>Team</dt><dd>' + esc(state.teamName) + ' · ' + state.teamSize + ' members</dd></div>'
      + '<div><dt>Leader</dt><dd>' + esc(state.fullName) + '</dd></div>'
      + '<div><dt>Email</dt><dd>' + esc(state.email) + '</dd></div>';
    document.getElementById('confirmSummary').innerHTML = rows;
  }
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('input[name="participantType"]').forEach(function (r) {
      r.addEventListener('change', function () {
        state.participantType = r.value;
        document.querySelectorAll('input[name="participantType"]').forEach(function (x) {
          x.closest('.opt').classList.toggle('selected', x.checked);
        });
      });
    });
    document.getElementById('f1').addEventListener('submit', function (e) {
      e.preventDefault();
      state.fullName = document.getElementById('fullName').value.trim();
      state.email = document.getElementById('email').value.trim();
      state.mobile = document.getElementById('mobile').value.trim();
      var ok = true;
      ok = err('e-type', state.participantType ? '' : 'Select student or working professional.') && ok;
      ok = err('e-name', state.fullName.length >= 2 ? '' : 'Enter your full name.') && ok;
      ok = err('e-email', validEmail(state.email) ? '' : 'Enter a valid email.') && ok;
      ok = err('e-mobile', state.mobile.replace(/\D/g, '').length >= 7 ? '' : 'Enter a valid mobile number.') && ok;
      if (ok) { renderMemberFields(); show(2); }
    });
    document.querySelectorAll('input[name="teamsize"]').forEach(function (r) {
      r.addEventListener('change', function () {
        state.teamSize = parseInt(r.value, 10);
        document.querySelectorAll('#sizePills .opt').forEach(function (x) {
          x.classList.toggle('selected', x.querySelector('input').checked);
        });
        renderMemberFields();
      });
    });
    document.querySelector('#sizePills .opt').classList.add('selected');
    document.getElementById('back2').addEventListener('click', function () { show(1); });
    document.getElementById('f2').addEventListener('submit', function (e) {
      e.preventDefault();
      state.teamName = document.getElementById('teamName').value.trim();
      var ok = err('e-tname', state.teamName.length >= 2 ? '' : 'Enter a team name.');
      state.members = [];
      for (var i = 2; i <= state.teamSize; i++) {
        var nm = document.getElementById('mname' + i).value.trim();
        var em = document.getElementById('mmail' + i).value.trim();
        ok = err('e-mname' + i, nm.length >= 2 ? '' : 'Enter a name.') && ok;
        ok = err('e-mmail' + i, validEmail(em) ? '' : 'Enter a valid email.') && ok;
        state.members.push({ name: nm, email: em });
      }
      if (ok) show(3);
    });
    document.querySelectorAll('input[name="pay"]').forEach(function (r) {
      r.addEventListener('change', function () {
        state.payMethod = r.value;
        document.querySelectorAll('input[name="pay"]').forEach(function (x) {
          x.closest('.opt').classList.toggle('selected', x.checked);
        });
      });
    });
    document.getElementById('back3').addEventListener('click', function () { show(2); });
    document.getElementById('f3').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!err('e-pay', state.payMethod ? '' : 'Choose a payment method.')) return;
      if (!document.getElementById('agree').checked) {
        err('e-submit', 'Please confirm the details and consent to storage.');
        return;
      }
      err('e-submit', '');
      var btn = document.getElementById('submitBtn');
      btn.disabled = true;
      btn.textContent = 'Submitting…';
      var table = state.participantType === 'student' ? 'student_registrations' : 'professional_registrations';
      var row = {
        full_name: state.fullName,
        email: state.email,
        mobile: state.mobile,
        team_name: state.teamName,
        team_size: state.teamSize,
        members: [{ name: state.fullName, email: state.email, role: 'leader' }]
          .concat(state.members.map(function (m) { return { name: m.name, email: m.email, role: 'member' }; })),
        pay_method: state.payMethod
      };
      supabaseInsert(table, row).then(function () {
        btn.disabled = false;
        btn.textContent = 'Submit Registration';
        show(4);
      }).catch(function (ex) {
        btn.disabled = false;
        btn.textContent = 'Submit Registration';
        err('e-submit', 'Could not reach the registration server (' + (ex.message || 'network error') + '). Please check your connection and try again.');
      });
    });
    document.getElementById('again').addEventListener('click', function () {
      state.participantType = ''; state.fullName = ''; state.email = ''; state.mobile = '';
      state.teamName = ''; state.teamSize = 2; state.members = []; state.payMethod = '';
      document.querySelectorAll('input').forEach(function (i) {
        if (i.type === 'radio' || i.type === 'checkbox') i.checked = false; else i.value = '';
      });
      document.querySelector('input[name="teamsize"][value="2"]').checked = true;
      document.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('selected'); });
      document.querySelector('#sizePills .opt').classList.add('selected');
      renderMemberFields();
      show(1);
    });
    renderMemberFields();
    show(1);
  });
})();
