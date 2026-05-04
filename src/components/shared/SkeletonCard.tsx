import { Card, CardContent } from "@/components/ui/card";

export function SkeletonAnnonceCard() {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-secondary animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-4 bg-secondary rounded animate-pulse w-3/4" />
          <div className="h-4 bg-secondary rounded animate-pulse w-16" />
        </div>
        <div className="h-3 bg-secondary rounded animate-pulse w-1/2" />
        <div className="flex gap-2">
          <div className="h-3 bg-secondary rounded animate-pulse w-20" />
          <div className="h-3 bg-secondary rounded animate-pulse w-16" />
        </div>
        <div className="flex justify-between items-center pt-1 border-t">
          <div className="h-3 bg-secondary rounded animate-pulse w-16" />
          <div className="h-8 bg-secondary rounded animate-pulse w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonTableRow() {
  return (
    <tr>
      {[...Array(5)].map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 bg-secondary rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-3">
      <div className="flex justify-between">
        <div className="h-4 bg-secondary rounded animate-pulse w-24" />
        <div className="h-8 w-8 bg-secondary rounded-full animate-pulse" />
      </div>
      <div className="h-8 bg-secondary rounded animate-pulse w-20" />
      <div className="h-3 bg-secondary rounded animate-pulse w-32" />
    </div>
  );
}

export function SkeletonAnnoncesGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {[...Array(count)].map((_, i) => (
        <SkeletonAnnonceCard key={i} />
      ))}
    </div>
  );
}