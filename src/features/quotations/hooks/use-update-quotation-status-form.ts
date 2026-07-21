"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { extractApiErrorMessage } from "@/features/auth/lib/extract-api-error-message";
import { formatQuotationRefId } from "@/features/quotations/lib/format-quotation";
import {
  useGetQuotationDetailQuery,
  useUpdateQuotationStatusMutation,
} from "@/redux/api/quotations.api";
import type {
  TQuotationListItem,
  TQuotationStatus,
  TUpdateQuotationStatusPayload,
} from "@/types/quotation.type";

export const QUOTATION_STATUS_OPTIONS: Array<{
  value: TQuotationStatus;
  label: string;
}> = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
];

type TUseUpdateQuotationStatusFormOptions = {
  quotation: TQuotationListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function useUpdateQuotationStatusForm({
  quotation,
  open,
  onOpenChange,
}: TUseUpdateQuotationStatusFormOptions) {
  const [status, setStatus] = useState<TQuotationStatus>("draft");
  const [completedOptionId, setCompletedOptionId] = useState("");
  const [updateQuotationStatus, { isLoading: isSaving }] =
    useUpdateQuotationStatusMutation();

  const detailQuery = useGetQuotationDetailQuery(quotation?.id ?? "", {
    skip: !open || !quotation?.id || status !== "confirmed",
  });

  const optionChoices = useMemo(() => {
    const options = detailQuery.data?.data.options ?? [];
    return options.map((option, index) => ({
      id: option.id,
      label: option.title.trim() || `Option ${index + 1}`,
    }));
  }, [detailQuery.data?.data.options]);

  useEffect(() => {
    if (!open || !quotation) return;
    setStatus(quotation.status);
    setCompletedOptionId(quotation.completedOptionId ?? "");
  }, [open, quotation]);

  useEffect(() => {
    if (status !== "confirmed") {
      setCompletedOptionId("");
      return;
    }

    if (completedOptionId) return;
    if (quotation?.completedOptionId) {
      setCompletedOptionId(quotation.completedOptionId);
      return;
    }

    const firstOptionId = optionChoices[0]?.id;
    if (firstOptionId) setCompletedOptionId(firstOptionId);
  }, [completedOptionId, optionChoices, quotation?.completedOptionId, status]);

  const saveStatus = async () => {
    if (!quotation) return;

    if (status === "confirmed" && !completedOptionId) {
      toast.error("Select the completed option.");
      return;
    }

    const body: TUpdateQuotationStatusPayload =
      status === "confirmed"
        ? { status, completedOptionId }
        : { status };

    try {
      await updateQuotationStatus({ id: quotation.id, body }).unwrap();
      toast.success("Status updated", {
        description: `${formatQuotationRefId(quotation.refId)} is now ${status}.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Could not update status."));
    }
  };

  const isLoadingOptions = status === "confirmed" && detailQuery.isLoading;
  const hasOptionError = status === "confirmed" && detailQuery.isError;
  const canSave =
    Boolean(quotation) &&
    !isSaving &&
    !isLoadingOptions &&
    !hasOptionError &&
    (status !== "confirmed" || Boolean(completedOptionId));

  return {
    status,
    setStatus,
    completedOptionId,
    setCompletedOptionId,
    optionChoices,
    isSaving,
    isLoadingOptions,
    hasOptionError,
    canSave,
    saveStatus,
  };
}
