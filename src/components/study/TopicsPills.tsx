type Props = {
  topics?: string[]
}

export function TopicsPills({ topics }: Props) {
  if (!topics || topics.length === 0) return null

  return (
    <div className="space-y-3">
      <p className="text-sm text-primary font-semibold tracking-wide uppercase">Key Topics</p>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <button
            key={topic}
            className="rounded-full bg-muted px-3 py-1 text-sm text-foreground hover:bg-muted/80 transition-colors"
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  )
}
