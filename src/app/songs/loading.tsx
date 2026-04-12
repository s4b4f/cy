import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SongsLoading() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>응원가 목록</CardTitle>
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

