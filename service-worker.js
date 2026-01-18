// public/service-worker.js
let timerInterval;
let seconds = 0;

self.onmessage = (event) => {
  if (event.data.action === 'START_TIMER') {
    seconds = event.data.value || seconds;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      seconds++;
      self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({ type: 'TICK', seconds }));
      });
    }, 1000);
  }
  if (event.data.action === 'STOP_TIMER') clearInterval(timerInterval);
};