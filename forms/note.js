const tg = window.Telegram.WebApp;
const urlParams = new URLSearchParams(window.location.search);
const chatId = urlParams.get('chatId');
const threadId = urlParams.get('threadId');
const webhookUrl = 'https://trinai.api.workflow.dcmake.it/webhook/a0b6b2cb-4e19-4a92-9269-6b6d8a7afb80';

const form = document.getElementById('noteForm');
const cancelBtn = document.getElementById('cancelBtn');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const data = {
    chatId: chatId,
    threadId: threadId,
    type: 'note',
    title: document.getElementById('noteTitle').value,
    content: document.getElementById('noteContent').value
  };
  
  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => {});
  
  tg.close();
});

cancelBtn.addEventListener('click', () => tg.close());
