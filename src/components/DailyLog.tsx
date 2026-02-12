import { useState, useEffect } from 'react';
import { MapPin, Camera } from 'lucide-react';
import { todayISO, formatDayName, getGreeting, getDaySentence } from '../utils/date';
import { fetchWeather, type WeatherResult } from '../utils/weather';

type Props = {
  onLocations: () => void;
  onGenerateReport: () => void;
  onSectionTap?: (section: string) => void;
};

const SECTIONS = [
  { id: 'schedule', label: 'SCHEDULE' },
  { id: 'meals', label: 'MEALS' },
  { id: 'nap', label: 'NAP' },
  { id: 'activities', label: 'ACTIVITIES' },
  { id: 'care', label: 'CARE NOTES' },
  { id: 'summary', label: 'DAILY SUMMARY' },
  { id: 'internal', label: 'INTERNAL NOTES' },
] as const;

export function DailyLog({ onLocations, onGenerateReport, onSectionTap }: Props) {
  const date = todayISO();
  const dayName = formatDayName(date);
  const greeting = getGreeting();
  const daySentence = getDaySentence(date);

  const [weather, setWeather] = useState<WeatherResult | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setWeatherLoading(true);
    setWeatherError(false);
    fetchWeather()
      .then((result) => {
        if (!cancelled) {
          setWeather(result);
          setWeatherLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setWeatherError(true);
          setWeatherLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const weatherLine = weatherLoading
    ? '…'
    : weatherError
      ? ''
      : `${weather!.tempF}°F and ${weather!.description}`;

  return (
    <div className="nanny-screen nanny-bg">
      {/* Page 1: full screen — header + intro (greeting, day, weather) */}
      <section className="nanny-first-page">
        <header className="nanny-header">
          <h1 className="nanny-title">
            DAILY LOG — {dayName}
          </h1>
          <button
            type="button"
            onClick={onLocations}
            className="nanny-icon-btn"
            aria-label="Locations"
          >
            <MapPin className="nanny-icon" />
          </button>
        </header>
        <div className="nanny-intro">
          <p className="nanny-intro-line">{greeting}</p>
          <p className="nanny-intro-line">{daySentence}</p>
          {weatherLine ? (
            <p className="nanny-intro-line nanny-intro-weather">{weatherLine}</p>
          ) : weatherLoading ? (
            <p className="nanny-intro-line nanny-intro-weather nanny-intro-loading">Loading weather…</p>
          ) : null}
          <p className="nanny-intro-scroll-hint">Scroll for daily log</p>
        </div>
      </section>

      {/* Page 2: flashcards (scroll to reach) */}
      <main className="nanny-daily-main">
        <div className="nanny-grid">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`nanny-section ${id === 'internal' ? 'nanny-section-internal' : ''}`}
              onClick={() => onSectionTap?.(id)}
            >
              <span className="nanny-section-label">{label}</span>
            </button>
          ))}
          <button
            type="button"
            className="nanny-section nanny-section-photo"
            onClick={() => onSectionTap?.('photo')}
          >
            <Camera className="nanny-icon nanny-icon-photo" />
            <span className="nanny-section-label">ADD PHOTO</span>
          </button>
        </div>

        <button
          type="button"
          className="nanny-cta"
          onClick={onGenerateReport}
        >
          GENERATE WEEKLY REPORT
        </button>
        <p className="nanny-hint">TAP A SECTION TO BEGIN LOGGING</p>
      </main>
    </div>
  );
}

