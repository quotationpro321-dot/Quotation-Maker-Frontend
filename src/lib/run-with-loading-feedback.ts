import type { MutableRefObject } from "react";
import { flushSync } from "react-dom";
import { toast } from "sonner";

type TRunWithLoadingFeedbackParams = {
  guardRef: MutableRefObject<boolean>;
  setLoading: (loading: boolean) => void;
  loadingMessage: string;
  successMessage: string;
  errorMessage: string;
  run: () => Promise<void>;
};

export async function runWithLoadingFeedback({
  guardRef,
  setLoading,
  loadingMessage,
  successMessage,
  errorMessage,
  run,
}: TRunWithLoadingFeedbackParams): Promise<void> {
  if (guardRef.current) return;

  guardRef.current = true;
  flushSync(() => setLoading(true));

  const toastId = toast.loading(loadingMessage);

  try {
    await run();
    toast.success(successMessage, { id: toastId });
  } catch (error) {
    const message =
      error instanceof Error && error.message.trim()
        ? error.message
        : errorMessage;
    toast.error(message, { id: toastId });
  } finally {
    guardRef.current = false;
    setLoading(false);
  }
}
