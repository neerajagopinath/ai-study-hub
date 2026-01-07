import { Button } from "@/components/ui/button"

type Props = {
  message?: string
  onRetry?: () => void
}

export function ErrorStateCard({ message, onRetry }: Props) {
  return (
    <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6 space-y-3">
      <p className="text-sm font-semibold text-destructive">We couldn&apos;t load your study kit.</p>
      <p className="text-muted-foreground text-sm">{message || "Please check the document and retry."}</p>
      <Button variant="destructive" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}
