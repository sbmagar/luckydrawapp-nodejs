const express = require('express');
const Redis = require('ioredis');
const bodyParser = require('body-parser');

const app = express();
const redis = new Redis({
  host: 'localhost',
  port: 6379
});

app.use(bodyParser.json());

app.get('/', async (req, res) => {
  const participants = await redis.lrange('participants', 0, -1);
  if (!participants.length) {
    return res.send("No participants found. Please register first.");
  }

  const shuffledParticipants = shuffleArray(participants);
  const luckyWinner = shuffledParticipants.pop();
  await redis.ltrim('participants', 0, -participants.length);

  return res.send(`Congratulations! The lucky winner is: ${luckyWinner}`);
});

app.get('/register/:participant', async (req, res) => {
  const participant = req.params.participant;
  await redis.rpush('participants', participant);
  return res.send(`${participant} has been registered as a participant.`);
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
