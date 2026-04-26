import { useCallback, useId, useState } from "react";
import "./TipsBlock.css";

export type TipOptionId = "none" | "1" | "2" | "3";

const OPTIONS: { id: TipOptionId; label: string }[] = [
  { id: "none", label: "No tip" },
  { id: "1", label: "1,00 €" },
  { id: "2", label: "2,00 €" },
  { id: "3", label: "3,00 €" },
];

type TipsBlockProps = {
  /** Controlled selection (when set, `defaultSelectedId` is only used before first `value`). */
  value?: TipOptionId;
  /** Which chip is selected initially when uncontrolled. */
  defaultSelectedId?: TipOptionId;
  onChange?: (id: TipOptionId) => void;
  /** When false, chips are non-interactive (static layout / preview). */
  interactive?: boolean;
};

export function TipsBlock({
  value,
  defaultSelectedId = "none",
  onChange,
  interactive = true,
}: TipsBlockProps) {
  const [innerId, setInnerId] = useState<TipOptionId>(defaultSelectedId);
  const controlled = value !== undefined;
  const selectedId = controlled ? value : innerId;
  const groupId = useId();

  const select = useCallback(
    (id: TipOptionId) => {
      if (!controlled) setInnerId(id);
      onChange?.(id);
    },
    [controlled, onChange],
  );

  return (
    <div
      className="tips"
      role="group"
      aria-labelledby={`${groupId}-label`}
      aria-disabled={!interactive}
    >
      <span id={`${groupId}-label`} className="visually-hidden">
        Tip amount
      </span>
      <div className="tips__row">
        {OPTIONS.map((opt) => {
          const selected = opt.id === selectedId;
          const cls = `tips__chip${selected ? " tips__chip--selected" : ""}`;
          if (!interactive) {
            return (
              <span key={opt.id} className={cls}>
                {opt.label}
              </span>
            );
          }
          return (
            <button
              key={opt.id}
              type="button"
              className={cls}
              aria-pressed={selected}
              onClick={() => select(opt.id)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
