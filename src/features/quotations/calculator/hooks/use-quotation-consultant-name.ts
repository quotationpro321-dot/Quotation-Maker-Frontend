"use client";

import { useOptionalSession } from "@/contexts/SessionContext";
import { useUser } from "@/hooks/useUser";
import { useGetMyProfileQuery } from "@/redux/api/dashboard.api";

/**
 * Consultant identity for the classic Umrah PDF footer — name and WhatsApp
 * number sourced from GET /dashboard/profile (name falls back to cached login).
 */
export function useQuotationConsultantName() {
  const session = useOptionalSession();
  const { name: cachedName } = useUser();
  const { data: profileResponse, isLoading, isFetching } = useGetMyProfileQuery(
    undefined,
    { skip: !session },
  );

  const profileName = profileResponse?.data?.name?.trim() ?? "";
  const consultantName = profileName || cachedName?.trim() || "";
  const consultantWhatsapp = profileResponse?.data?.whatsappNumber?.trim() ?? "";

  return {
    consultantName,
    consultantWhatsapp,
    isLoadingProfile: Boolean(session) && (isLoading || isFetching) && !consultantName,
  };
}
