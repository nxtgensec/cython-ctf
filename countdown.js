/* CYTHON CTF — live event countdown (Asia/Kolkata).
   Event: Oct 30 2026 10:00 AM IST -> Oct 31 2026 10:00 PM IST (36h).
   Pure helpers are exported for testing; DOM wiring runs only in browsers. */
var CYTHON_EVENT = {
  startIso: '2026-10-30T10:00:00+05:30',
  endIso: '2026-10-31T22:00:00+05:30',
  timeZone: 'Asia/Kolkata'
};
CYTHON_EVENT.startMs = Date.parse(CYTHON_EVENT.startIso);
CYTHON_EVENT.endMs = Date.parse(CYTHON_EVENT.endIso);

function cythonNowMs() {
  if (typeof window !== 'undefined' && typeof window.__cythonNow === 'function') return window.__cythonNow();
  return Date.now();
}
function cythonPhase(nowMs, startMs, endMs) {
  if (nowMs >= endMs) return 'ended';
  if (nowMs >= startMs) return 'live';
  return 'before';
}
function cythonSplitUnits(totalSeconds) {
  var t = Math.max(0, Math.floor(totalSeconds));
  var days = Math.floor(t / 86400);
  var hours = Math.floor((t % 86400) / 3600);
  var minutes = Math.floor((t % 3600) / 60);
  var seconds = t % 60;
  return { days: days, hours: hours, minutes: minutes, seconds: seconds };
}
function cythonPad2(n) { return (n < 10 ? '0' : '') + n; }
function cythonSnapshot(nowMs) {
  var phase = cythonPhase(nowMs, CYTHON_EVENT.startMs, CYTHON_EVENT.endMs);
  var target = phase === 'live' ? CYTHON_EVENT.endMs : CYTHON_EVENT.startMs;
  var units = cythonSplitUnits((target - nowMs) / 1000);
  return { phase: phase, units: units };
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function () {
    var label = document.getElementById('hxState');
    var dEl = document.getElementById('hxD');
    var hEl = document.getElementById('hxH');
    var mEl = document.getElementById('hxM');
    var sEl = document.getElementById('hxS');
    var cells = document.getElementById('hxCells');
    var live = document.getElementById('hxLive');
    var thanks = document.getElementById('hxThanks');
    var sr = document.getElementById('hxSrStatus');
    if (!label || !dEl) return;
    var timerId = null;
    var lastPhase = null;
    function paint(snap) {
      var u = snap.units;
      dEl.textContent = String(u.days);
      hEl.textContent = cythonPad2(u.hours);
      mEl.textContent = cythonPad2(u.minutes);
      sEl.textContent = cythonPad2(u.seconds);
      if (snap.phase !== lastPhase) {
        lastPhase = snap.phase;
        label.classList.remove('is-live', 'is-ended');
        if (snap.phase === 'before') {
          label.textContent = 'EVENT STARTS IN';
          cells.hidden = false; live.hidden = true; thanks.hidden = true;
          sr.textContent = 'Countdown to event start.';
        } else if (snap.phase === 'live') {
          label.textContent = 'CYTHON CTF IS LIVE';
          label.classList.add('is-live');
          cells.hidden = false; live.hidden = false; thanks.hidden = true;
          sr.textContent = 'The event is live. Countdown to event end.';
        } else {
          label.textContent = 'THE BATTLE HAS ENDED';
          label.classList.add('is-ended');
          cells.hidden = true; live.hidden = true; thanks.hidden = false;
          sr.textContent = 'The event has ended.';
        }
      }
    }
    function tick() {
      var snap = cythonSnapshot(cythonNowMs());
      paint(snap);
      if (snap.phase === 'ended' && timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }
    }
    tick();
    if (cythonPhase(cythonNowMs(), CYTHON_EVENT.startMs, CYTHON_EVENT.endMs) !== 'ended') {
      timerId = setInterval(tick, 1000);
    }
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CYTHON_EVENT: CYTHON_EVENT,
    cythonPhase: cythonPhase,
    cythonSplitUnits: cythonSplitUnits,
    cythonSnapshot: cythonSnapshot,
    cythonPad2: cythonPad2
  };
}
