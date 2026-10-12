import { useState, type FormEvent } from "react";
import type { ApiPayee } from "@/client/transactions/apiTypes";
import { useCreateReviewedPayee } from "@/client/transactions/hooks/useCreateReviewedPayee";
import { Button } from "@/components/Button/Button";

type NewPayeeFormProps = {
  clientId: string;
  onCreated: (payee: ApiPayee) => void;
  onCancel: () => void;
};

// Inline form for typing in a new payee name. The payee is created already reviewed.
export function NewPayeeForm({ clientId, onCreated, onCancel }: NewPayeeFormProps) {
  const [name, setName] = useState("");
  const { createReviewedPayee, creating, errorMessage } = useCreateReviewedPayee(clientId);

  const trimmedName = name.trim();

  async function handleSubmit(event: FormEvent) {
    // This form sits inside the dialog; don't let Enter submit or reload anything else.
    event.preventDefault();
    if (trimmedName === "") {
      return;
    }
    const payee = await createReviewedPayee(trimmedName);
    if (payee) {
      onCreated(payee);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1">
      <div className="flex gap-2">
        <input
          className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-2 py-1.5 dark:border-gray-600 dark:bg-gray-900"
          placeholder="New payee name"
          aria-label="New payee name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoFocus
        />
        <Button type="submit" variant="primary" disabled={trimmedName === "" || creating}>
          {creating ? "Adding…" : "Add"}
        </Button>
        <Button onClick={onCancel} disabled={creating}>
          Cancel
        </Button>
      </div>
      {errorMessage && <p className="text-red-700 dark:text-red-300">{errorMessage}</p>}
    </form>
  );
}
