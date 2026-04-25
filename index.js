const express = require('express');
const app = express();

// --- YOUR SETTINGS ---
const OPEN_HOUR = 9;       // 9am
const CLOSE_HOUR = 17;     // 5pm
const TIMEZONE = 'America/New_York';
const OPEN_DAYS = [1,2,3,4,5]; // Mon=1, Fri=5 (0=Sun, 6=Sat)

const GREETING_BIN_URL   = https://api.telnyx.com/v2/media/Greeting_for_1800_number.xml;
const AFTERHOURS_BIN_URL = https://api.telnyx.com/v2/media/AfterHours.xml;
// ---------------------

function isBusinessHours() {
  const now = new Date().toLocaleString('en-US', { timeZone: TIMEZONE });
  const d = new Date(now);
  const hour = d.getHours();
  const day = d.getDay();
  return OPEN_DAYS.includes(day) && hour >= OPEN_HOUR && hour < CLOSE_HOUR;
}

app.post('/voice', (req, res) => {
  const url = isBusinessHours() ? GREETING_BIN_URL : AFTERHOURS_BIN_URL;
  res.set('Content-Type', 'text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Redirect>${url}</Redirect>
</Response>`);
});

app.listen(3000, () => console.log('Running on port 3000'));
