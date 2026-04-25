const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const OPEN_HOUR = 9;
const CLOSE_HOUR = 17;
const TIMEZONE = 'America/New_York';
const OPEN_DAYS = [0,1,2,3,4,5,6];

const GREETING_BIN_URL   = 'https://api.telnyx.com/v2/media/Greeting_for_1800_number.xml';
const AFTERHOURS_BIN_URL = 'https://api.telnyx.com/v2/media/AfterHours.xml';

function isBusinessHours() {
  const now = new Date().toLocaleString('en-US', { timeZone: TIMEZONE });
  const d = new Date(now);
  const hour = d.getHours();
  const day = d.getDay();
  return OPEN_DAYS.includes(day) && hour >= OPEN_HOUR && hour < CLOSE_HOUR;
}

app.post('/voice', (req, res) => {
  const open = isBusinessHours();
  console.log('Call received. Business hours: ' + open);
  const url = open ? GREETING_BIN_URL : AFTERHOURS_BIN_URL;
  res.set('Content-Type', 'text/xml');
  res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Redirect>' + url + '</Redirect></Response>');
});

app.get('/', (req, res) => res.send('Telnyx router is running.'));

app.listen(3000, () => console.log('Running on port 3000'));
