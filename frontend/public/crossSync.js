const CHANNEL_NAME = 'LastUpdated';
const CHECK_INTERVAL = 20;

document.addEventListener("DOMContentLoaded", () => {
  const submitSigalButton = document.querySelector('#submitSignal');
  submitSigalButton.addEventListener('click', checkForUpadte());
});

function checkForUpadte() {
  if (window.localStorage) {
    setInterval(() => {
        window.localStorage.removeItem(CHANNEL_NAME);
    }, CHECK_INTERVAL);
  }
}
