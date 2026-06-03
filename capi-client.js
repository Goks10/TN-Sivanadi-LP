function genEventId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'ev-' + Math.random().toString(36).slice(2) + '-' + Date.now();
}

function sendCapiEvent(eventName, eventId, extra) {
  var fbp = (document.cookie.match(/_fbp=([^;]+)/) || [])[1] || '';
  var fbc = (document.cookie.match(/_fbc=([^;]+)/) || [])[1] || '';
  fetch('/api/capi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.assign({
      event_name: eventName,
      event_id: eventId,
      event_source_url: window.location.href,
      fbp: fbp,
      fbc: fbc,
    }, extra || {})),
  }).catch(function() {});
}
