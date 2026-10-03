import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { gameApi } from "@/api";
import { createNewState, produce, productionRates } from "@/game/logic";
import * as C from "@/game/config";

const GameCtx = createContext(null);
export const useGame = () => useContext(GameCtx);

// Backward compatibility for older saves (add bench/ids/needsSquad, free-placement towers).
function normalizeState(s) {
  if (!s.bench) s.bench = [];
  if (Array.isArray(s.heroes)) {
    s.heroes.forEach((h) => {
      if (h && !h.id) h.id = `${h.cls || h.key}-${Math.random().toString(36).slice(2)}`;
    });
  }
  if (s.needsSquad === undefined) {
    s.needsSquad = !(Array.isArray(s.heroes) && s.heroes.length > 0);
  }
  if (Array.isArray(s.towers)) {
    const defaults = [[60, 180], [360, 180], [60, 300], [360, 300], [210, 205]];
    s.towers = s.towers.filter(Boolean);
    s.towers.forEach((t, i) => {
      if (!t.id) t.id = `tw-${Math.random().toString(36).slice(2)}`;
      if (t.x == null || t.y == null) {
        const d = defaults[i % 5];
        t.x = d[0];
        t.y = d[1];
      }
    });
  } else {
    s.towers = [];
  }
  return s;
}

function applyOfflineAccrual(state) {
  const lastSeen = state?.lastSeen;
  if (!lastSeen) {
    state.lastSeen = new Date().toISOString();
    return { state, gains: null };
  }

  const then = new Date(lastSeen).getTime();
  if (!Number.isFinite(then)) {
    state.lastSeen = new Date().toISOString();
    return { state, gains: null };
  }

  const elapsedMin = Math.max(
    0,
    Math.min(C.TIME.offlineCapHours * 60, (Date.now() - then) / 60000)
  );

  if (elapsedMin <= 1) {
    state.lastSeen = new Date().toISOString();
    return { state, gains: null };
  }

  const rates = productionRates(state);
  const gold = rates.gold * elapsedMin;
  const stone = rates.stone * elapsedMin;
  const food = rates.food * elapsedMin;

  state.gold += gold;
  state.stone += stone;
  state.food += food;
  state.lastSeen = new Date().toISOString();

  return {
    state,
    gains: {
      minutes: Math.round(elapsedMin * 10) / 10,
      gold: Math.round(gold * 10) / 10,
      stone: Math.round(stone * 10) / 10,
      food: Math.round(food * 10) / 10,
    },
  };
}

export function GameProvider({ children }) {
  const [state, setState] = useState(null);
  const [screen, setScreen] = useState("home");
  const [loading, setLoading] = useState(true);
  const [offlineGains, setOfflineGains] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const stateRef = useRef(null);
  const saveTimer = useRef(null);

  stateRef.current = state;

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data } = await gameApi.getState();
        let finalState;

        if (data.state) {
          const result = applyOfflineAccrual(data.state);
          finalState = normalizeState(result.state);
          if (result.gains) setOfflineGains(result.gains);
          await gameApi.saveState(finalState);
        } else {
          finalState = createNewState();
          await gameApi.saveState(finalState);
        }

        if (!mounted) return;
        setState(finalState);
        if (finalState.needsSquad) setScreen("squad");
      } catch (e) {
        if (!mounted) return;
        // A fresh local state is still playable; the next save will retry.
        const fresh = createNewState();
        setState(fresh);
        setScreen("squad");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const scheduleSave = useCallback((s) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      gameApi.saveState(s).catch(() => {});
    }, 700);
  }, []);

  const mutate = useCallback((fn) => {
    setState((prev) => {
      const clone = structuredClone(prev);
      fn(clone);
      scheduleSave(clone);
      return clone;
    });
  }, [scheduleSave]);

  const saveNow = useCallback(() => {
    if (stateRef.current) gameApi.saveState(stateRef.current).catch(() => {});
  }, []);

  const hasState = !!state;

  useEffect(() => {
    if (!hasState || (screen !== "prep" && screen !== "home")) return;

    const id = setInterval(() => {
      setState((prev) => {
        if (!prev) return prev;
        const clone = structuredClone(prev);
        produce(clone, 1);
        return clone;
      });
    }, 1000);

    const save = setInterval(() => saveNow(), 8000);

    return () => {
      clearInterval(id);
      clearInterval(save);
    };
  }, [screen, hasState, saveNow]);

  return (
    <GameCtx.Provider value={{
      state, setState, mutate, saveNow, loading,
      screen, setScreen, offlineGains, setOfflineGains,
      lastResult, setLastResult,
    }}>
      {children}
    </GameCtx.Provider>
  );
}
