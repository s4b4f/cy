import { Badge } from "@/components/ui/badge";
import { REQUEST_STATUS_BADGE_VARIANT, REQUEST_STATUS_LABEL } from "@/features/requests/constants";
import type { RequestStatus } from "@/features/requests/types";

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return <Badge variant={REQUEST_STATUS_BADGE_VARIANT[status]}>{REQUEST_STATUS_LABEL[status]}</Badge>;
}

