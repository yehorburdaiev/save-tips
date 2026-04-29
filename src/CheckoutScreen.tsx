import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { VariantId } from "./PrototypeChrome";
import { TipsBlock, type TipOptionId } from "./TipsBlock";
import { assets } from "./figmaAssets";
import "./CheckoutScreen.css";

export type CheckoutScreenProps = {
  variant: VariantId;
  nextSession: boolean;
};

function pageScrollHeight() {
  return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
}

/** True when the viewport is within `thresholdPx` of the page bottom (call synchronously before layout changes). */
function isNearBottom(thresholdPx: number) {
  return window.innerHeight + window.scrollY >= pageScrollHeight() - thresholdPx;
}

function IconBack() {
  return (
    <svg className="checkout__nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 6L9 12l6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBin() {
  return (
    <svg className="checkout__nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 4h6l1 2h5v2H3V6h5l1-2zm1 5h12l-1 12H11L10 9z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconDelivery() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 16h2v2H4v-2zm14 0h2v2h-2v-2zM4 8h11v8H4V8zm13 0h3l2 3v5h-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconPickup() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3C8 7 6 10 6 13a6 6 0 1012 0c0-3-2-6-6-10z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="2" fill="currentColor" />
    </svg>
  );
}

function IconSchedule() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6 19c0-3.3 2.7-6 6-6s6 2.7 6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}

function IconOffer() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7l8-4 8 4v10l-8 4-8-4V7z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 9h6v6H9z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function CheckoutScreen({ variant, nextSession }: CheckoutScreenProps) {
  const [tipId, setTipId] = useState<TipOptionId>("none");
  /** Persists until the user turns the switch off; not reset when changing tip amount. */
  const [saveTipDefaultOn, setSaveTipDefaultOn] = useState(false);

  const tipBlockRef = useRef<HTMLElement>(null);
  /** When true, tip-block height growth/shrink is compensated so the bottom of the page stays put. */
  const scrollCompensateRef = useRef(false);
  const pinClearTimeoutRef = useRef(0);

  const saveTipDefaultOnRef = useRef(saveTipDefaultOn);
  saveTipDefaultOnRef.current = saveTipDefaultOn;

  const showSaveTipRow = variant !== "a" && tipId !== "none";

  const stackLoaderPrevRef = useRef<{ variant: VariantId; nextSession: boolean } | null>(
    null,
  );
  const [showVariantLoader, setShowVariantLoader] = useState(false);

  const clearTipScrollPins = useCallback(() => {
    scrollCompensateRef.current = false;
    if (pinClearTimeoutRef.current) {
      window.clearTimeout(pinClearTimeoutRef.current);
      pinClearTimeoutRef.current = 0;
    }
  }, []);

  useEffect(() => {
    const prev = stackLoaderPrevRef.current;
    stackLoaderPrevRef.current = { variant, nextSession };
    if (prev === null) return;
    if (prev.variant === variant && prev.nextSession === nextSession) return;

    setShowVariantLoader(true);
    const id = window.setTimeout(() => setShowVariantLoader(false), 300);
    return () => window.clearTimeout(id);
  }, [variant, nextSession]);

  useEffect(() => {
    setTipId("none");
    setSaveTipDefaultOn(false);
    clearTipScrollPins();
  }, [variant, clearTipScrollPins]);

  const prevNextSessionRef = useRef(nextSession);

  useEffect(() => {
    const prev = prevNextSessionRef.current;
    if (prev === nextSession) return;
    prevNextSessionRef.current = nextSession;

    if (nextSession) {
      if (variant === "a") {
        setTipId("none");
        setSaveTipDefaultOn(false);
        clearTipScrollPins();
        return;
      }
      if (saveTipDefaultOnRef.current) {
        return;
      }
      setTipId("none");
      setSaveTipDefaultOn(false);
      clearTipScrollPins();
      return;
    }

    setTipId("none");
    setSaveTipDefaultOn(false);
    clearTipScrollPins();
  }, [nextSession, variant, clearTipScrollPins]);

  const handleTipIdChange = (id: TipOptionId) => {
    if (variant === "c" && tipId === "none" && id !== "none") {
      setSaveTipDefaultOn(true);
    }
    const togglesSaveRow = (tipId === "none") !== (id === "none");
    if (togglesSaveRow) {
      scrollCompensateRef.current = isNearBottom(100);
      if (pinClearTimeoutRef.current) window.clearTimeout(pinClearTimeoutRef.current);
      pinClearTimeoutRef.current = window.setTimeout(() => {
        scrollCompensateRef.current = false;
        pinClearTimeoutRef.current = 0;
      }, 450);
    } else {
      scrollCompensateRef.current = false;
      if (pinClearTimeoutRef.current) {
        window.clearTimeout(pinClearTimeoutRef.current);
        pinClearTimeoutRef.current = 0;
      }
    }
    setTipId(id);
  };

  useLayoutEffect(() => {
    const el = tipBlockRef.current;
    if (!el) return;
    let prevH = el.getBoundingClientRect().height;
    const ro = new ResizeObserver(() => {
      const h = el.getBoundingClientRect().height;
      if (prevH > 0 && scrollCompensateRef.current) {
        const delta = h - prevH;
        if (delta !== 0) {
          window.scrollBy({ top: delta, left: 0, behavior: "auto" });
        }
      }
      prevH = h;
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      if (pinClearTimeoutRef.current) window.clearTimeout(pinClearTimeoutRef.current);
    };
  }, []);

  return (
    <div className="checkout" aria-label="Checkout">
      <div className="checkout__sticky-head">
        <div className="checkout__status">
          <span>9:41</span>
          <div className="checkout__status-icons" aria-hidden>
            <span>●●●</span>
          </div>
        </div>

        <header className="checkout__nav">
          <div className="checkout__nav-row">
            <IconBack />
            <h1 className="checkout__nav-title">Balti Uulits</h1>
            <IconBin />
          </div>
        </header>
      </div>

      <div className="checkout__stack">
        <section className="checkout__section-pad">
          <article className="checkout__order-item">
            <div className="checkout__order-top">
              <img
                className="checkout__thumb"
                src={assets.orderFood1}
                alt=""
              />
              <div className="checkout__order-body">
                <h2 className="checkout__order-title">Poke with chicken</h2>
                <div className="checkout__order-options">
                  <p>Extra egg (0,50 €)</p>
                  <p>2 × Extra avacado (2,00 €)</p>
                  <p>Extra bacon (1,00 €)</p>
                </div>
                <p className="checkout__order-note">No onions please</p>
                <p className="checkout__order-price">9,00 €</p>
              </div>
              <div className="checkout__counter-wrap">
                <div className="checkout__counter">
                  <img src={assets.orderMinus} alt="" className="checkout__counter-minus" />
                  <span className="checkout__counter-val">1</span>
                  <img src={assets.orderPlus} alt="" className="checkout__counter-plus" />
                </div>
              </div>
            </div>
            <div className="checkout__hairline" />
          </article>

          <article className="checkout__order-item">
            <div className="checkout__order-top">
              <img
                className="checkout__thumb"
                src={assets.orderFood2}
                alt=""
              />
              <div className="checkout__order-body">
                <h2 className="checkout__order-title">Pizza Margherita</h2>
                <p className="checkout__order-note">No onions please</p>
                <p className="checkout__order-price">7,00 €</p>
              </div>
              <div className="checkout__counter-wrap">
                <div className="checkout__counter">
                  <img src={assets.orderMinus} alt="" className="checkout__counter-minus" />
                  <span className="checkout__counter-val">1</span>
                  <img src={assets.orderPlus} alt="" className="checkout__counter-plus" />
                </div>
              </div>
            </div>
            <div className="checkout__hairline" />
          </article>

          <div className="checkout__list-row">
            <img src={assets.orderAddIcon} alt="" />
            <span className="checkout__link-text">Add more</span>
          </div>
          <div className="checkout__hairline" />

          <div className="checkout__comment">
            <p>Need cutlery? Napkins? Other?</p>
            <p>Leave a comment...</p>
          </div>
          <div className="checkout__hairline" />
        </section>

        <section className="checkout__popular">
          <div className="checkout__popular-head">
            <h2 className="checkout__popular-title">People also added</h2>
            <div className="checkout__popular-all">
              All
              <IconChevronRight />
            </div>
          </div>
          <div className="checkout__popular-strip">
            <div className="checkout__card">
              <div className="checkout__card-img-wrap">
                <img
                  className="checkout__card-img"
                  src={assets.popular1}
                  alt=""
                />
                <div className="checkout__card-tint" />
                <span className="checkout__discount">−25 %</span>
              </div>
              <div className="checkout__card-add">
                <div className="checkout__card-add-inner">
                  <img src={assets.popularPlus} alt="" />
                </div>
              </div>
              <div className="checkout__card-meta checkout__price-stack">
                <p className="checkout__price-now">11,50 €</p>
                <p className="checkout__price-was">13,50 €</p>
                <p className="checkout__card-name">Poke with Salmon</p>
              </div>
            </div>
            <div className="checkout__card">
              <div className="checkout__card-img-wrap">
                <img
                  className="checkout__card-img"
                  src={assets.popular2}
                  alt=""
                />
                <div className="checkout__card-tint" />
              </div>
              <div className="checkout__card-add">
                <div className="checkout__card-add-inner">
                  <img src={assets.popularPlus} alt="" />
                </div>
              </div>
              <div className="checkout__card-meta">
                <p className="checkout__order-price" style={{ margin: 0 }}>
                  12,50 €
                </p>
                <p className="checkout__card-name">Poke with Chicken</p>
              </div>
            </div>
            <div className="checkout__card">
              <div className="checkout__card-img-wrap">
                <img
                  className="checkout__card-img"
                  src={assets.popular3}
                  alt=""
                />
                <div className="checkout__card-tint" />
              </div>
              <div className="checkout__card-add">
                <div className="checkout__card-add-inner">
                  <img src={assets.popularPlus} alt="" />
                </div>
              </div>
              <div className="checkout__card-meta">
                <p className="checkout__order-price" style={{ margin: 0 }}>
                  12,50 €
                </p>
                <p className="checkout__card-name">Poke with Tofu</p>
              </div>
            </div>
            <div className="checkout__card">
              <div className="checkout__card-img-wrap">
                <img
                  className="checkout__card-img"
                  src={assets.popular1}
                  alt=""
                />
                <div className="checkout__card-tint" />
              </div>
              <div className="checkout__card-add">
                <div className="checkout__card-add-inner">
                  <img src={assets.popularPlus} alt="" />
                </div>
              </div>
              <div className="checkout__card-meta">
                <p className="checkout__order-price" style={{ margin: 0 }}>
                  1,50 €
                </p>
                <p className="checkout__card-name">Poke with salmon</p>
              </div>
            </div>
          </div>
        </section>

        <div className="checkout__thick-divider" />

        <section className="checkout__section-pad" style={{ paddingTop: 16, paddingBottom: 16 }}>
          <h2 className="checkout__delivery-title">Delivery or pickup?</h2>
          <div className="checkout__delivery-block">
            <div className="checkout__delivery-row">
              <div className="checkout__delivery-main">
                <IconDelivery />
                <div className="checkout__delivery-text">
                  <strong>Delivery</strong>
                  <span>15-20 min</span>
                </div>
              </div>
              <div className="checkout__delivery-end">
                <span>2,50 €</span>
                <div className="checkout__radio checkout__radio--on" />
              </div>
            </div>
            <div className="checkout__hairline" />
          </div>
          <div className="checkout__delivery-block">
            <div className="checkout__delivery-row">
              <div className="checkout__delivery-main">
                <IconPickup />
                <div className="checkout__delivery-text">
                  <strong>Pickup</strong>
                  <span>15-20 min</span>
                </div>
              </div>
              <div className="checkout__delivery-end">
                <span>0,00 €</span>
                <div className="checkout__radio" />
              </div>
            </div>
            <div className="checkout__hairline" />
          </div>
          <div className="checkout__delivery-block">
            <div className="checkout__delivery-row">
              <div className="checkout__delivery-main">
                <IconSchedule />
                <div className="checkout__delivery-text">
                  <strong>Schedule</strong>
                  <span>Select time</span>
                </div>
              </div>
              <div className="checkout__delivery-end">
                <div className="checkout__radio" />
              </div>
            </div>
            <div className="checkout__hairline" />
          </div>
          <div className="checkout__delivery-block">
            <div className="checkout__delivery-row">
              <div className="checkout__delivery-main">
                <IconUser />
                <div className="checkout__delivery-text">
                  <strong>Robot</strong>
                  <span>25-40 min</span>
                </div>
              </div>
              <div className="checkout__delivery-end">
                <span>1,50 €</span>
                <div className="checkout__radio" />
              </div>
            </div>
          </div>
        </section>

        <div className="checkout__thick-divider" />

        <section className="checkout__section-pad checkout__promo">
          <IconOffer />
          <span className="checkout__promo-text">Add promo code</span>
          <svg className="checkout__chevron" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M10 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </section>

        <div className="checkout__thick-divider" />

        <section className="checkout__section-pad" style={{ paddingTop: 16 }}>
          <div className="checkout__receipt-line">
            <span className="checkout__receipt-left">
              Discount
              <img src={assets.info} alt="" />
            </span>
            <span className="checkout__receipt-right">−7,00 €</span>
          </div>
          <div className="checkout__receipt-line">
            <span className="checkout__receipt-left">Packaging fee</span>
            <span className="checkout__receipt-right">1,00 €</span>
          </div>
          <div className="checkout__receipt-line checkout__receipt-line--accent">
            <span className="checkout__receipt-left">Subtotal</span>
            <span className="checkout__receipt-right">10,00 €</span>
          </div>
          <div className="checkout__receipt-line">
            <span className="checkout__receipt-left">
              Small order fee
              <img src={assets.info} alt="" />
            </span>
            <span className="checkout__receipt-right">6,00 €</span>
          </div>
          <div className="checkout__receipt-line">
            <span className="checkout__receipt-left">
              Service fee
              <img src={assets.info} alt="" />
            </span>
            <span className="checkout__receipt-right">0,30 €</span>
          </div>
          <div className="checkout__receipt-line">
            <span className="checkout__receipt-left">Tips</span>
            <span className="checkout__receipt-right">0,00 €</span>
          </div>
          <div className="checkout__receipt-line">
            <span className="checkout__receipt-left">Delivery fee</span>
            <span className="checkout__receipt-right">1,50 €</span>
          </div>

          <div className="checkout__receipt-total-block">
            <div className="checkout__receipt-total-rule" />
            <div className="checkout__receipt-total-line">
              <span>Total</span>
              <span>16,80 €</span>
            </div>
          </div>
        </section>

        <div className="checkout__thick-divider" />

        <section className="checkout__section-pad" style={{ paddingTop: 0 }}>
          <div className="checkout__map-address">
            <IconPin />
            <p>Vana-Louna 37, Tallinn</p>
            <svg className="checkout__chevron" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M10 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="checkout__hairline" />

          <div className="checkout__map-view">
            <img src={assets.mapBg} alt="" />
            <div className="checkout__map-fab">Adjust pin</div>
          </div>

          <div className="checkout__field">Apartment, flat or suite number</div>
          <div className="checkout__field-row">
            <div className="checkout__field">Entry code</div>
            <div className="checkout__field">Floor</div>
          </div>
          <div className="checkout__field">Building name</div>

          <h3 className="checkout__drop-title">Dropoff instructions*</h3>
          <div className="checkout__chip-row">
            <span className="checkout__chip checkout__chip--on">Meet at my door</span>
            <span className="checkout__chip">Leave at my door</span>
            <span className="checkout__chip">Meet outside</span>
            <span className="checkout__chip">Leave at building reception</span>
            <span className="checkout__chip">Meet in the lobby</span>
          </div>
          <div className="checkout__field" style={{ marginBottom: 4 }}>
            Additional note
          </div>
          <p className="checkout__hint">*Required</p>
        </section>

        <div className="checkout__thick-divider" />

        <section
          ref={tipBlockRef}
          className={`checkout__tip-block${tipId === "none" ? " checkout__tip-block--no-tip" : ""}`}
        >
          <div className="checkout__tip-intro">
            <img src={assets.courier} alt="" />
            <div>
              <h2>Tip the courier?</h2>
              <p>
                The courier will get 100% of your tip. You can cancel the tip
                later.
              </p>
            </div>
          </div>
          <TipsBlock interactive value={tipId} onChange={handleTipIdChange} />
          {variant !== "a" ? (
            <div
              className="checkout__save-row-collapsible"
              data-collapsed={showSaveTipRow ? "false" : "true"}
              aria-hidden={!showSaveTipRow}
              inert={!showSaveTipRow ? true : undefined}
            >
              <div className="checkout__save-row-collapsible-inner">
                <div className="checkout__save-row">
                  <span>Save tip for next time</span>
                  <button
                    type="button"
                    className={`checkout__switch${saveTipDefaultOn ? " checkout__switch--on" : ""}`}
                    role="switch"
                    aria-checked={saveTipDefaultOn}
                    onClick={() => setSaveTipDefaultOn((v) => !v)}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <div className="checkout__thick-divider" />

        <section className="checkout__bottom-total">
          <div className="checkout__bottom-total-line">
            <span>Total</span>
            <span>17,00 €</span>
          </div>

          <div className="checkout__pay-row">
            <img src={assets.wallet} alt="" />
            <div className="checkout__pay-label">
              <div className="checkout__pay-label-row">
                <span>Bolt Balance</span>
                <img src={assets.info} alt="" />
              </div>
            </div>
            <span className="checkout__pay-amt">8,50 €</span>
          </div>

          <div className="checkout__pay-row">
            <img src={assets.cash} alt="" />
            <div className="checkout__pay-label">
              <div className="checkout__pay-label-row">
                <span>Cash</span>
              </div>
              <p className="checkout__pay-sub">Change</p>
            </div>
            <span className="checkout__pay-amt">8,50 €</span>
          </div>
        </section>

        <div className="checkout__cta-wrap">
          <div className="checkout__cta">
            <div className="checkout__cta-fab">
              <img src={assets.ctaArrow} alt="" />
            </div>
            <div className="checkout__cta-text">
              <strong>Place order</strong>
              <span>Slide to confirm</span>
            </div>
          </div>
        </div>

        <div className="checkout__home-indicator">
          <span />
        </div>

        {showVariantLoader ? (
          <div
            className="checkout__stack-loader"
            role="status"
            aria-live="polite"
            aria-label="Loading"
          >
            <div className="checkout__stack-loader-spinner" aria-hidden />
          </div>
        ) : null}
      </div>
    </div>
  );
}
