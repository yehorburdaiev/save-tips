import { useState } from "react";
import { CheckoutScreen } from "./CheckoutScreen";
import { PrototypeChrome, type VariantId } from "./PrototypeChrome";

export default function App() {
  const [variant, setVariant] = useState<VariantId>("a");
  const [nextSession, setNextSession] = useState(false);

  const handleVariantChange = (id: VariantId) => {
    setVariant(id);
    setNextSession(false);
  };

  return (
    <>
      <PrototypeChrome
        variant={variant}
        onVariantChange={handleVariantChange}
        nextSession={nextSession}
        onNextSessionChange={setNextSession}
      />
      <CheckoutScreen variant={variant} nextSession={nextSession} />
    </>
  );
}
