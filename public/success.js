var params = new URLSearchParams(window.location.search);
var sessionId = params.get('session_id');

if (sessionId) {
  fetch('/api/checkout?sessionid=' + sessionId)
    .then(result => {
      return result.json();
    })
    .then(session => {
      var data = JSON.stringify(session, null, 2);
      document.querySelector('pre').textContent = data;
    })
    .catch(err => {
      console.log('Error when fetching Checkout session', err);
    });
}
