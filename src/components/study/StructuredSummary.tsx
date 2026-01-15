import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  Target, 
  Key, 
  Lightbulb, 
  FileText, 
  AlertTriangle 
} from "lucide-react"

interface SummarySection {
  id: string
  title: string
  icon: React.ReactNode
  content: string
  type: 'definition' | 'importance' | 'concepts' | 'examples' | 'tips' | 'mistakes'
}

interface StructuredSummaryProps {
  summary: string
}

export function StructuredSummary({ summary }: StructuredSummaryProps) {
  const parseSummary = (text: string): SummarySection[] => {
    const sections: SummarySection[] = []
    
    // Define section patterns with their corresponding icons and types
    const sectionPatterns = [
      {
        pattern: /📚\s*\*\*(.*?)\*\*[\s\S]*?(?=🎯|🔑|💡|📝|⚠️|$)/,
        title: "What is it?",
        icon: <BookOpen className="h-5 w-5 text-blue-500" />,
        type: 'definition' as const
      },
      {
        pattern: /🎯\s*\*\*(.*?)\*\*[\s\S]*?(?=🔑|💡|📝|⚠️|📚|$)/,
        title: "Why Does It Matter?",
        icon: <Target className="h-5 w-5 text-green-500" />,
        type: 'importance' as const
      },
      {
        pattern: /🔑\s*\*\*(.*?)\*\*[\s\S]*?(?=💡|📝|⚠️|🎯|📚|$)/,
        title: "Key Concepts",
        icon: <Key className="h-5 w-5 text-purple-500" />,
        type: 'concepts' as const
      },
      {
        pattern: /💡\s*\*\*(.*?)\*\*[\s\S]*?(?=📝|⚠️|🔑|🎯|📚|$)/,
        title: "Simple Examples",
        icon: <Lightbulb className="h-5 w-5 text-yellow-500" />,
        type: 'examples' as const
      },
      {
        pattern: /📝\s*\*\*(.*?)\*\*[\s\S]*?(?=⚠️|💡|🔑|🎯|📚|$)/,
        title: "Quick Tips",
        icon: <FileText className="h-5 w-5 text-indigo-500" />,
        type: 'tips' as const
      },
      {
        pattern: /⚠️\s*\*\*(.*?)\*\*[\s\S]*?(?=📝|💡|🔑|🎯|📚|$)/,
        title: "Common Mistakes to Avoid",
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        type: 'mistakes' as const
      }
    ]

    // Try to extract structured sections
    for (const { pattern, title, icon, type } of sectionPatterns) {
      const match = text.match(pattern)
      if (match) {
        let content = match[0]
        
        // Clean up the content
        content = content
          .replace(/📚\s*\*\*(.*?)\*\*/, '') // Remove emoji and title
          .replace(/🎯\s*\*\*(.*?)\*\*/, '')
          .replace(/🔑\s*\*\*(.*?)\*\*/, '')
          .replace(/💡\s*\*\*(.*?)\*\*/, '')
          .replace(/📝\s*\*\*(.*?)\*\*/, '')
          .replace(/⚠️\s*\*\*(.*?)\*\*/, '')
          .replace(/\*\*/g, '') // Remove bold markdown
          .replace(/\*/g, '') // Remove italic markdown
          .replace(/#{1,6}\s/g, '') // Remove markdown headers
          .trim()

        if (content.length > 20) { // Only add if there's substantial content
          sections.push({
            id: type,
            title,
            icon,
            content: cleanContent(content),
            type
          })
        }
      }
    }

    // If no structured sections found, create fallback sections
    if (sections.length === 0) {
      // Try to split by common patterns
      const paragraphs = text.split(/\n\n|\r\n\r\n/).filter(p => p.trim().length > 50)
      
      if (paragraphs.length > 1) {
        paragraphs.forEach((para, index) => {
          sections.push({
            id: `section-${index}`,
            title: `Part ${index + 1}`,
            icon: <BookOpen className="h-5 w-5 text-blue-500" />,
            content: cleanContent(para),
            type: 'definition'
          })
        })
      } else {
        // Single paragraph - create one section
        sections.push({
          id: 'main',
          title: 'Overview',
          icon: <BookOpen className="h-5 w-5 text-blue-500" />,
          content: cleanContent(text),
          type: 'definition'
        })
      }
    }

    return sections
  }

  const cleanContent = (content: string): string => {
    return content
      .replace(/\*\*/g, '') // Remove bold markdown
      .replace(/\*/g, '') // Remove italic markdown
      .replace(/#{1,6}\s/g, '') // Remove markdown headers
      .replace(/\n{3,}/g, '\n\n') // Reduce multiple newlines
      .replace(/^\s+|\s+$/g, '') // Trim whitespace
      .trim()
  }

  const formatContent = (content: string): string => {
    // Convert bullet points to proper formatting
    return content
      .replace(/•\s/g, '\n• ') // Ensure bullet points are on new lines
      .replace(/-\s/g, '\n- ') // Handle dash bullets
      .replace(/\d+\.\s/g, '\n$&') // Ensure numbered lists are on new lines
      .replace(/\n{3,}/g, '\n\n') // Clean up excessive newlines
      .trim()
  }

  const sections = parseSummary(summary)

  if (sections.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No summary content available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <Card key={section.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              {section.icon}
              <CardTitle className="text-lg">{section.title}</CardTitle>
              <Badge variant="secondary" className="ml-auto">
                {section.type}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {formatContent(section.content)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
