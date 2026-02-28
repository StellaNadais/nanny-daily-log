import { useState, useEffect } from 'react';
import { MapPin, Cloud, CloudRain, Sun, CloudSnow, ChevronDown, Lock } from 'lucide-react';
import { getGreetingText } from '../utils/date';
import { ScheduleSection } from './ScheduleSection';
import type { Gig, Request } from '../types';

// Moraga, CA coordinates
const MORAGA_LAT = 37.835;
const MORAGA_LON = -122.13;

// Chinese dragon GIF for the hero
const HERO_GIF_URL = 'https://media.giphy.com/media/FuryYJiAsImCqXc2Fs/giphy.gif';

type WeatherData = {
  temp: number;
  desc: string;
  icon: 'sun' | 'cloud' | 'rain' | 'snow';
} | null;

async function fetchWeather(): Promise<WeatherData> {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${MORAGA_LAT}&longitude=${MORAGA_LON}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=America/Los_Angeles`
    );
    const data = await res.json();
    const temp = Math.round(data.current?.temperature_2m ?? 0);
    const code = data.current?.weather_code ?? 0;
    let desc = 'Clear';
    let icon: 'sun' | 'cloud' | 'rain' | 'snow' = 'sun';
    if (code >= 61 && code <= 67) {
      desc = 'Rain';
      icon = 'rain';
    } else if (code >= 71 && code <= 77) {
      desc = 'Snow';
      icon = 'snow';
    } else if (code >= 1 && code <= 3) {
      desc = 'Partly cloudy';
      icon = 'cloud';
    } else if (code >= 45 && code <= 48) {
      desc = 'Foggy';
      icon = 'cloud';
    }
    return { temp, desc, icon };
  } catch {
    return null;
  }
}

const WeatherIcon = ({ icon }: { icon: 'sun' | 'cloud' | 'rain' | 'snow' }) => {
  const cls = 'nanny-icon';
  if (icon === 'sun') return <Sun className={cls} />;
  if (icon === 'cloud') return <Cloud className={cls} />;
  if (icon === 'rain') return <CloudRain className={cls} />;
  return <CloudSnow className={cls} />;
};

type Props = {
  gigs: Gig[];
  requests: Request[];
  onLocations: () => void;
  onSectionTap: (section: string) => void;
  onGenerateReport?: () => void;
  onAddGig?: (date: string) => void;
  onAddRequest?: () => void;
  onApproveRequest?: (req: Request) => void;
  onDeclineRequest?: (req: Request) => void;
};

const SECTIONS = [
  { id: 'shift', label: 'Shift' },
  { id: 'meals', label: 'Meals' },
  { id: 'kid-journal', label: 'Kid Journal' },
  { id: 'trip-log', label: 'Trip Log' },
  { id: 'internal-notes', label: 'Internal Notes' },
] as const;

export function HomeScreen({ gigs, requests, onLocations, onSectionTap, onGenerateReport, onAddGig, onAddRequest, onApproveRequest, onDeclineRequest }: Props) {
  const [weather, setWeather] = useState<WeatherData>(null);

  useEffect(() => {
    fetchWeather().then(setWeather);
  }, []);

  const fullGreeting = getGreetingText();
  const commaIdx = fullGreeting.indexOf(', ');
  const greeting = commaIdx >= 0 ? fullGreeting.slice(0, commaIdx) : fullGreeting;
  const dayPart = commaIdx >= 0 ? fullGreeting.slice(commaIdx + 2) : '';

  return (
    <div className="nanny-screen nanny-bg">
      <header className="nanny-header">
        <div />
        <button type="button" onClick={onLocations} className="nanny-icon-btn" aria-label="Locations">
          <MapPin className="nanny-icon" />
        </button>
      </header>

      <main className="nanny-home-main">
        <section className="nanny-home-page nanny-hero">
          <div className="nanny-hero-gif">
            <img
              src={HERO_GIF_URL}
              alt=""
              loading="lazy"
            />
          </div>
          <h1 className="nanny-greeting">{greeting}</h1>
          {dayPart && <p className="nanny-hero-day">{dayPart}</p>}
          <div className="nanny-weather">
            {weather ? (
              <>
                <WeatherIcon icon={weather.icon} />
                <span>{weather.temp}°F — {weather.desc}</span>
              </>
            ) : (
              <span className="nanny-weather-loading">Loading weather…</span>
            )}
          </div>
          <p className="nanny-hero-scroll-hint">
            <ChevronDown className="nanny-icon" />
            Scroll down to view availability and request a date
          </p>
        </section>

        <ScheduleSection
          gigs={gigs}
          requests={requests}
          onAddGig={onAddGig}
          onAddRequest={onAddRequest}
          onApproveRequest={onApproveRequest}
          onDeclineRequest={onDeclineRequest}
        />

        <section className="nanny-home-page nanny-flashcards">
          <p className="nanny-private-banner">
            <Lock className="nanny-icon" />
            Private — Nanny access only
          </p>
          <div className="nanny-grid-cards">
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                className="nanny-flashcard"
                onClick={() => onSectionTap(id)}
              >
                <span className="nanny-flashcard-label">{label}</span>
              </button>
            ))}
          </div>
          {onGenerateReport && (
            <button type="button" onClick={onGenerateReport} className="nanny-cta">
              Generate weekly report
            </button>
          )}
        </section>
      </main>
    </div>
  );
}
