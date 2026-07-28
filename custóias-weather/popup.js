const LAT = 41.1945;
const LON = -8.6499;

// WMO Weather Code → emoji + descrição
function wmoToEmoji(code) {
  if (code === 0) return { emoji: '☀️', desc: 'Céu limpo' };
  if (code <= 2) return { emoji: '🌤️', desc: 'Parcialmente nublado' };
  if (code === 3) return { emoji: '☁️', desc: 'Nublado' };
  if (code <= 49) return { emoji: '🌫️', desc: 'Nevoeiro' };
  if (code <= 59) return { emoji: '🌦️', desc: 'Chuvisco' };
  if (code <= 69) return { emoji: '🌧️', desc: 'Chuva' };
  if (code <= 79) return { emoji: '❄️', desc: 'Neve' };
  if (code <= 84) return { emoji: '🌦️', desc: 'Aguaceiros' };
  if (code <= 94) return { emoji: '⛈️', desc: 'Trovoada' };
  return { emoji: '⛈️', desc: 'Trovoada forte' };
}

// Graus → seta Unicode + direção cardinal
function windDirection(deg) {
  const dirs = ['N','NE','E','SE','S','SO','O','NO'];
  const arrows = ['↑','↗','→','↘','↓','↙','←','↖'];
  const i = Math.round(deg / 45) % 8;
  return { dir: dirs[i], arrow: arrows[i] };
}

function windBeaufort(kmh) {
  if (kmh < 2) return 'Calmo';
  if (kmh < 12) return 'Fraco';
  if (kmh < 30) return 'Moderado';
  if (kmh < 50) return 'Forte';
  if (kmh < 75) return 'Muito forte';
  return 'Tempestade';
}

async function fetchWeather() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
    `&current=temperature_2m,weathercode,windspeed_10m,winddirection_10m` +
    `&hourly=temperature_2m,weathercode,windspeed_10m,winddirection_10m` +
    `&timezone=Europe%2FLisbon&forecast_days=2`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Erro na API');
  return res.json();
}

function getHourlyIndex(data, targetDate, targetHour) {
  return data.hourly.time.findIndex(t => {
    const d = new Date(t);
    return d.toDateString() === targetDate.toDateString() && d.getHours() === targetHour;
  });
}

function buildNowCard(data) {
  const c = data.current;
  const { emoji, desc } = wmoToEmoji(c.weathercode);
  const { dir, arrow } = windDirection(c.winddirection_10m);
  const strength = windBeaufort(c.windspeed_10m);

  return `
    <div class="card-emoji">${emoji}</div>
    <div class="now-info">
      <div class="card-temp">${Math.round(c.temperature_2m)}°C</div>
      <div class="card-desc">${desc}</div>
      <div class="wind">
        <span class="wind-arrow">${arrow}</span>
        ${dir} · ${Math.round(c.windspeed_10m)} km/h · ${strength}
      </div>
    </div>
  `;
}

function buildCard(data, idx, period) {
  const temp = data.hourly.temperature_2m[idx];
  const wcode = data.hourly.weathercode[idx];
  const wspeed = data.hourly.windspeed_10m[idx];
  const wdir = data.hourly.winddirection_10m[idx];

  const { emoji, desc } = wmoToEmoji(wcode);
  const { dir, arrow } = windDirection(wdir);
  const strength = windBeaufort(wspeed);

  return `
    <div class="card-period">${period}</div>
    <div style="display:flex;align-items:center;gap:8px">
      <span style="font-size:22px">${emoji}</span>
      <span class="card-temp-small">${Math.round(temp)}°C</span>
    </div>
    <div class="card-desc">${desc}</div>
    <div class="wind">
      <span class="wind-arrow">${arrow}</span>
      ${dir} · ${Math.round(wspeed)} km/h · ${strength}
    </div>
  `;
}

async function init() {
  const loading = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const content = document.getElementById('content');
  const updatedEl = document.getElementById('updated');

  try {
    const data = await fetchWeather();

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    // Índices horários: manhã = 9h, tarde = 15h
    const idxTodayMorning    = getHourlyIndex(data, now, 9);
    const idxTodayAfternoon  = getHourlyIndex(data, now, 15);
    const idxTomorrowMorning   = getHourlyIndex(data, tomorrow, 9);
    const idxTomorrowAfternoon = getHourlyIndex(data, tomorrow, 15);

    document.getElementById('card-now').innerHTML = buildNowCard(data);
    document.getElementById('card-today-morning').innerHTML    = buildCard(data, idxTodayMorning, '🌅 Manhã');
    document.getElementById('card-today-afternoon').innerHTML  = buildCard(data, idxTodayAfternoon, '☀️ Tarde');
    document.getElementById('card-tomorrow-morning').innerHTML   = buildCard(data, idxTomorrowMorning, '🌅 Manhã');
    document.getElementById('card-tomorrow-afternoon').innerHTML = buildCard(data, idxTomorrowAfternoon, '☀️ Tarde');

    updatedEl.textContent = now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

    loading.style.display = 'none';
    content.style.display = 'block';
  } catch (e) {
    loading.style.display = 'none';
    errorEl.style.display = 'block';
    errorEl.textContent = '⚠️ Não foi possível carregar o tempo. Verifica a ligação.';
  }
}

document.addEventListener('DOMContentLoaded', init);
