"use client";

import { useLocale, type Locale } from "@/src/i18n/LocaleContext";

interface LanguageSwitcherProps {
  variant?: "boot" | "topbar" | "settings";
}

const OPTIONS: readonly { locale: Locale; short: string; label: string }[] = [
  { locale: "es", short: "ES", label: "Español" },
  { locale: "en", short: "EN", label: "English" },
];

export function LanguageSwitcher({
  variant = "boot",
}: LanguageSwitcherProps) {
  const { locale, setLocale, text } = useLocale();

  return (
    <div
      className={`language-switcher language-switcher--${variant}`}
      role="group"
      aria-label={text("Elegir idioma", "Choose language")}
    >
      {variant === "boot" ? (
        <span className="language-switcher__label">
          {text("Elige tu idioma", "Choose your language")}
        </span>
      ) : null}
      <div className="language-switcher__options">
        {OPTIONS.map((option) => (
          <button
            key={option.locale}
            type="button"
            className="language-switcher__option"
            aria-pressed={locale === option.locale}
            aria-label={option.label}
            onClick={() => setLocale(option.locale)}
          >
            <span>{option.short}</span>
            {variant !== "topbar" ? <strong>{option.label}</strong> : null}
          </button>
        ))}
      </div>
    </div>
  );
}
