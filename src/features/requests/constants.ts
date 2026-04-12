export const REQUEST_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;

export const REQUEST_STATUS_LABEL: Record<(typeof REQUEST_STATUSES)[number], string> = {
  PENDING: "대기",
  APPROVED: "승인",
  REJECTED: "반려"
};

export const REQUEST_STATUS_BADGE_VARIANT: Record<
  (typeof REQUEST_STATUSES)[number],
  "outline" | "default" | "destructive"
> = {
  PENDING: "outline",
  APPROVED: "default",
  REJECTED: "destructive"
};

