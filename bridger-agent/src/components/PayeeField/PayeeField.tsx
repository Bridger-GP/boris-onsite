import { useState } from "react";
import type { ApiPayee } from "@/client/transactions/apiTypes";
import { Button } from "@/components/Button/Button";
import { EntitySelect } from "@/components/EntitySelect/EntitySelect";
import { NewPayeeForm } from "@/components/NewPayeeForm/NewPayeeForm";

type PayeeFieldProps = {
  clientId: string;
  payees: ApiPayee[];
  payeeId: string | null;
  onChange: (payeeId: string) => void;
  disabled: boolean;
};

// Payee dropdown, plus a "New payee" option to type in a payee that isn't in the list yet.
export function PayeeField({ clientId, payees, payeeId, onChange, disabled }: PayeeFieldProps) {
  const [isAddingPayee, setIsAddingPayee] = useState(false);

  // Select the new payee and go back to the dropdown, which now includes it.
  function handleCreated(payee: ApiPayee) {
    onChange(payee.id);
    setIsAddingPayee(false);
  }

  return (
    <div className="flex flex-col gap-1">
      <EntitySelect
        label="Payee"
        options={payees}
        value={payeeId}
        placeholder="Select a payee"
        onChange={(id) => {
          // The placeholder can't be re-selected here, so id is always set.
          if (id !== null) {
            onChange(id);
          }
        }}
        disabled={disabled || isAddingPayee}
      />
      {isAddingPayee ? (
        <NewPayeeForm
          clientId={clientId}
          onCreated={handleCreated}
          onCancel={() => setIsAddingPayee(false)}
        />
      ) : (
        <div>
          <Button variant="ghost" onClick={() => setIsAddingPayee(true)} disabled={disabled} className="-ml-3">
            + New payee
          </Button>
        </div>
      )}
    </div>
  );
}
