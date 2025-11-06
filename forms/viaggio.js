const tg = window.Telegram.WebApp;
const urlParams = new URLSearchParams(window.location.search);
const chatId = urlParams.get('chatId');
const threadId = urlParams.get('threadId');
const webhookUrl = 'https://your-webhook-url.com';

const form = document.getElementById('travelForm');
const cancelBtn = document.getElementById('cancelBtn');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const data = {
    chatId: chatId,
    threadId: threadId,
    type: 'viaggio',
    partenza: document.getElementById('partenza').value,
    escludiPartenza: document.getElementById('escludiPartenza').value,
    arrivo: document.getElementById('arrivo').value,
    escludiArrivo: document.getElementById('escludiArrivo').value,
    notti: document.getElementById('notti').value,
    interessi: document.getElementById('interessi').value,
    adulti: document.getElementById('adulti').value,
    bambini: document.getElementById('bambini').value || 0
  };
  
  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => {});
  
  tg.close();
});

cancelBtn.addEventListener('click', () => tg.close());
