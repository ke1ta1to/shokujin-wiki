import { usePathname, useSearchParams } from "next/navigation";

export function useContinueUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const continueUrl = `${pathname}?${searchParams.toString()}`;

  return { continueUrl };
}
