import { type FormEvent, useState } from "react";
import "./PrototypeGate.css";

const STORAGE_KEY = "save-tips-prototype-gate";
const PASSWORD = "boltfood-design";

function readUnlockedFromSession(): boolean {
  try {
    return typeof sessionStorage !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function PrototypeGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(readUnlockedFromSession);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  if (unlocked) {
    return <>{children}</>;
  }

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value === PASSWORD) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* private / blocked storage */
      }
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div
      className="prototype-gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prototype-gate-title"
    >
      <form className="prototype-gate__card" onSubmit={submit}>
        <h1 id="prototype-gate-title" className="prototype-gate__title">
          Enter password
        </h1>
        <p className="prototype-gate__hint">This prototype is password-protected.</p>
        <label className="prototype-gate__label">
          <span className="visually-hidden">Password</span>
          <input
            type="password"
            className="prototype-gate__input"
            value={value}
            onChange={(ev) => {
              setValue(ev.target.value);
              setError(false);
            }}
            autoComplete="current-password"
            autoFocus
          />
        </label>
        {error ? (
          <p className="prototype-gate__error" role="alert">
            Incorrect password.
          </p>
        ) : null}
        <button type="submit" className="prototype-gate__submit">
          Unlock
        </button>
      </form>
    </div>
  );
}
