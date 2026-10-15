// CYTHON CTF — frontend-only 4-step registration (memory only, never submitted)
(function () {
  const state = { participantType: '', mode: '', fullName: '', email: '', mobile: '', teamName: '', teamSize: '', members: '', payMethod: '', agree: false };
  let step = 1;
  const panels = () => [1, 2, 3, 4].map(n => document.getElementById('panel-' + n));
  const sr = () => document.getElementById('stepLive');
  function show(n) {
    step = n;
    panels().forEach((p, i) => { if (p) p.hidden = (i + 1) !== n; });
    document.querySelectorAll('.stepper li').forEach((li, i) => {
      li.classList.toggle('active', (i + 1) === n);
      li.classList.toggle('done', (i + 1) < n);
      if ((i + 1) < n) li.querySelector('.step-dot').textContent = '✓';
      else li.querySelector('.step-dot').textContent = '0' + (i + 1);
    });
    const names = { 1: 'Participant Details', 2: 'Team Details', 3: 'Payment', 4: 'Confirmation' };
    if (sr()) sr().textContent = 'Step ' + n + ' of 4: ' + names[n];
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (n === 3) renderSummary();
    if (n === 4) renderConfirm();
  }
  function err(id, msg) {
    const e = document.getElementById(id);
    if (!e) return !msg;
    e.textContent = msg || ''; e.classList.toggle('show', !!msg);
    return !msg;
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[name="participantType"]').forEach(r => r.addEventListener('change', () => {
      state.participantType = r.value;
      document.querySelectorAll('input[name="participantType"]').forEach(x => x.closest('.opt').classList.toggle('selected', x.checked));
    }));
    document.querySelectorAll('input[name="mode"]').forEach(r => r.addEventListener('change', () => {
      state.mode = r.value;
      document.querySelectorAll('input[name="mode"]').forEach(x => x.closest('.opt').classList.toggle('selected', x.checked));
      document.getElementById('teamOnly').style.display = r.value === 'team' ? '' : 'none';
    }));
    document.getElementById('f1').addEventListener('submit', e => {
      e.preventDefault();
      state.fullName = document.getElementById('fullName').value.trim();
      state.email = document.getElementById('email').value.trim();
      state.mobile = document.getElementById('mobile').value.trim();
      let ok = true;
      ok = err('e-type', state.participantType ? '' : 'Select student or working professional.') && ok;
      ok = err('e-mode', state.mode ? '' : 'Select individual or team.') && ok;
      ok = err('e-name', state.fullName.length >= 2 ? '' : 'Enter your full name.') && ok;
      ok = err('e-email', /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.email) ? '' : 'Enter a valid email.') && ok;
      ok = err('e-mobile', state.mobile.replace(/\D/g, '').length >= 7 ? '' : 'Enter a valid mobile number.') && ok;
      if (ok) show(2);
    });
    document.getElementById('back2').addEventListener('click', () => show(1));
    document.getElementById('f2').addEventListener('submit', e => {
      e.preventDefault();
      if (state.mode === 'team') {
        state.teamName = document.getElementById('teamName').value.trim();
        state.teamSize = document.getElementById('teamSize').value;
        state.members = document.getElementById('members').value.trim();
        let ok = true;
        ok = err('e-tname', state.teamName.length >= 2 ? '' : 'Enter a team name.') && ok;
        ok = err('e-tsize', state.teamSize ? '' : 'Select team size.') && ok;
        if (!ok) return;
      }
      show(3);
    });
    document.querySelectorAll('input[name="pay"]').forEach(r => r.addEventListener('change', () => {
      state.payMethod = r.value;
      document.querySelectorAll('input[name="pay"]').forEach(x => x.closest('.opt').classList.toggle('selected', x.checked));
    }));
    document.getElementById('back3').addEventListener('click', () => show(2));
    document.getElementById('f3').addEventListener('submit', e => {
      e.preventDefault();
      if (!err('e-pay', state.payMethod ? '' : 'Choose a payment preview option.')) return;
      if (!document.getElementById('agree').checked) { alert('Please acknowledge the frontend-only preview notice.'); return; }
      show(4);
    });
    document.getElementById('again').addEventListener('click', () => {
      Object.keys(state).forEach(k => state[k] = '');
      document.querySelectorAll('input').forEach(i => { if (i.type === 'radio' || i.type === 'checkbox') i.checked = false; else i.value = ''; });
      document.querySelectorAll('.opt').forEach(o => o.classList.remove('selected'));
      document.getElementById('teamOnly').style.display = 'none';
      show(1);
    });
    show(1);
  });
  function renderSummary() {
    const el = document.getElementById('paySummary');
    if (el) el.innerHTML = '<div><dt>Name</dt><dd>' + esc(state.fullName) + '</dd></div>'
      + '<div><dt>Email</dt><dd>' + esc(state.email) + '</dd></div>'
      + '<div><dt>Type / Mode</dt><dd>' + esc(state.participantType) + ' / ' + esc(state.mode) + '</dd></div>'
      + (state.mode === 'team' ? '<div><dt>Team</dt><dd>' + esc(state.teamName) + ' (' + esc(state.teamSize) + ')</dd></div>' : '')
      + '<div><dt>Fee</dt><dd>Preview only — to be announced</dd></div>';
  }
  function renderConfirm() {
    const el = document.getElementById('confirmSummary');
    if (el) el.innerHTML = '<div><dt>Name</dt><dd>' + esc(state.fullName) + '</dd></div>'
      + '<div><dt>Email</dt><dd>' + esc(state.email) + '</dd></div>'
      + '<div><dt>Mobile</dt><dd>' + esc(state.mobile) + '</dd></div>'
      + '<div><dt>Participation</dt><dd>' + esc(state.participantType) + ' / ' + esc(state.mode) + '</dd></div>'
      + (state.mode === 'team' ? '<div><dt>Team</dt><dd>' + esc(state.teamName) + ' (' + esc(state.teamSize) + ')</dd></div>' : '');
  }
  function esc(s) { return String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
})();
