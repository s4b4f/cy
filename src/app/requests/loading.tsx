import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RequestsLoading() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>응원가 신청 게시판</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          <div className="h-10 w-full animate-pulse rounded-md bg-zinc-900" />
          <div className="h-72 w-full animate-pulse rounded-md bg-zinc-900" />
        </div>
      </CardContent>
    </Card>
  );
}

