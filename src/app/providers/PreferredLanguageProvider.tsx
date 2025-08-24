// app/providers/PreferredLanguageProvider.tsx
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import LanguageChooser from "@/app/components/LanguageChooser";

type Lang = "en" | "zh" | "ja" | "all";

interface PrefLangContext {
  lang: Lang | null;
  setLang: (l: Lang) => void;
  ready: boolean; // true after initial load
}

const PREF_KEY = "englearn.preferredLang";

const PrefLangCtx = createContext<PrefLangContext>({
  lang: null,
  setLang: () => {},
  ready: false,
});

export function usePreferredLanguage() {
  return useContext(PrefLangCtx);
}

export default function PreferredLanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang | null>(null);
  const [ready, setReady] = useState(false);
  const [showChooser, setShowChooser] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PREF_KEY);
      if (saved) {
        setLangState(saved as Lang);
        setReady(true);
      } else {
        // first visit -> show chooser
        setShowChooser(true);
        setReady(true); // ready true but lang null until chosen
      }
    } catch (err) {
      console.log(err);
      // localStorage may be blocked — fallback to showing chooser
      setShowChooser(true);
      setReady(true);
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    try {
      localStorage.setItem(PREF_KEY, l);
    } catch (err) {
      // ignore
      console.log(err);
    }
    setLangState(l);
    // hide chooser if visible
    setShowChooser(false);
    // dispatch a global event so non-context consumers can listen if wanted
    window.dispatchEvent(
      new CustomEvent("englearn:lang-changed", { detail: l })
    );
  }, []);

  return (
    <PrefLangCtx.Provider value={{ lang, setLang, ready }}>
      {children}
      <LanguageChooser
        visible={showChooser}
        onClose={() => setShowChooser(false)}
        onSelect={(l) => setLang(l)}
      />
    </PrefLangCtx.Provider>
  );
}
