const tg = window.Telegram.WebApp;
const urlParams = new URLSearchParams(window.location.search);
const chatId = urlParams.get('chatId');
const threadId = urlParams.get('threadId');
const webhookUrl = 'https://trinai.api.workflow.dcmake.it/webhook/a0b6b2cb-4e19-4a92-9269-6b6d8a7afb80';

const form = document.getElementById('eventForm');
const cancelBtn = document.getElementById('cancelBtn');

// Imposta data minima
const today = new Date().toISOString().split('T')[0];
document.getElementById('eventDate').value = today;
document.getElementById('eventDate').min = today;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const data = {
    chatId: chatId,
    threadId: threadId,
    type: 'agenda',
    date: document.getElementById('eventDate').value,
    time: document.getElementById('eventTime').value,
    description: document.getElementById('eventDesc').value,
    location: document.getElementById('eventLocation').value
  };
  
  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => {});
  
  tg.close();
});

cancelBtn.addEventListener('click', () => tg.close());
