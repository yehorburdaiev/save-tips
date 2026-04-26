import "./PrototypeChrome.css";

export type VariantId = "a" | "b" | "c";

const VARIANTS: { id: VariantId; label: string }[] = [
  { id: "a", label: "Variant A (control)" },
  { id: "b", label: "Variant B" },
  { id: "c", label: "Variant C" },
];

export type PrototypeChromeProps = {
  variant: VariantId;
  onVariantChange: (id: VariantId) => void;
  nextSession: boolean;
  onNextSessionChange: (on: boolean) => void;
};

export function PrototypeChrome({
  variant,
  onVariantChange,
  nextSession,
  onNextSessionChange,
}: PrototypeChromeProps) {
  return (
    <aside className="prototype-chrome" aria-label="Prototype controls">
      <span className="prototype-chrome__label" id="prototype-variant-label">
        Variant
      </span>
      <div
        className="prototype-chrome__segments"
        role="tablist"
        aria-labelledby="prototype-variant-label"
      >
        {VARIANTS.map((v) => {
          const selected = variant === v.id;
          return (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={`prototype-chrome__segment${selected ? " prototype-chrome__segment--active" : ""}`}
              onClick={() => onVariantChange(v.id)}
            >
              {v.label}
            </button>
          );
        })}
      </div>

      <div className="prototype-chrome__divider" aria-hidden />

      <div className="prototype-chrome__row">
        <span className="prototype-chrome__toggle-label" id="prototype-next-session-label">
          Next session
        </span>
        <button
          type="button"
          className={`prototype-chrome__switch${nextSession ? " prototype-chrome__switch--on" : ""}`}
          role="switch"
          aria-checked={nextSession}
          aria-labelledby="prototype-next-session-label"
          onClick={() => onNextSessionChange(!nextSession)}
        >
          <span className="prototype-chrome__switch-knob" aria-hidden />
        </button>
      </div>
    </aside>
  );
}
