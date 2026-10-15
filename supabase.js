// Supabase client config — anon/publishable key only (safe for browsers, guarded by RLS).
// Secrets (service_role, sb_secret, access token) live in .env.local and never ship to the browser.
var SUPABASE_URL = 'https://fwryjlqhmzgridjiafpn.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3cnlqbHFobXpncmlkamlhZnBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNTA1NTgsImV4cCI6MjEwNzYyNjU1OH0.xJ_fPMBeohi8TWPlHwvgeq6xMdcnvMZAY2a4yxoScck';

function supabaseInsert(table, row) {
  return fetch(SUPABASE_URL + '/rest/v1/' + table, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(row)
  }).then(function (res) {
    if (!res.ok) return res.json().catch(function () { return {}; }).then(function (e) {
      throw new Error((e && (e.message || e.hint)) || ('Request failed (' + res.status + ')'));
    });
    return res.text().then(function (t) { return t ? JSON.parse(t) : []; });
  });
}
