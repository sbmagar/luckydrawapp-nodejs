const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const participantsFile = 'participants.txt';

function loadParticipants() {
  if (!fs.existsSync(participantsFile)) {
    return [];
  }
  const data = fs.readFileSync(participantsFile, 'utf8');
  return data.split('\n').filter(participant => participant.trim() !== '');
}

function saveParticipants(participants) {
  fs.writeFileSync(participantsFile, participants.join('\n'));
}

app.get('/', (req, res) => {
  const participants = loadParticipants();
  if (!participants.length) {
    return res.send("No participants found. Please register first.");
  }

  const luckyWinner = participants[Math.floor(Math.random() * participants.length)];

  return res.send(`Congratulations! The lucky winner is: ${luckyWinner}`);
});

app.get('/register/:participant', (req, res) => {
  const participant = req.params.participant;
  const participants = loadParticipants();
  participants.push(participant);
  saveParticipants(participants);
  return res.send(`${participant} has been registered as a participant.`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
