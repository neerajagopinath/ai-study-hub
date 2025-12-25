import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { UploadPanel } from "@/components/tool/UploadPanel";
import { OptionsPanel, ToolOption } from "@/components/tool/OptionsPanel";
import { OutputPanel, OutputTab } from "@/components/tool/OutputPanel";
import { AIQualityControls, QualitySettings } from "@/components/tool/AIQualityControls";
import { useToolUsage } from "@/hooks/useToolUsage";

const options: ToolOption[] = [
  {
    id: "examType",
    label: "Exam Type",
    type: "select",
    options: [
      { value: "internal", label: "Internal Exam" },
      { value: "semester", label: "Semester Exam" },
      { value: "competitive", label: "Competitive Exam" },
    ],
  },
  {
    id: "depth",
    label: "Summary Depth",
    type: "select",
    options: [
      { value: "quick", label: "Quick Overview" },
      { value: "moderate", label: "Moderate Detail" },
      { value: "deep", label: "Deep Analysis" },
    ],
  },
  {
    id: "includeDefinitions",
    label: "Include Definitions",
    type: "toggle",
    defaultValue: true,
  },
  {
    id: "includeQuestions",
    label: "Generate Practice Questions",
    type: "toggle",
    defaultValue: true,
  },
  {
    id: "revisionSheet",
    label: "One-Night Revision Sheet",
    type: "toggle",
    defaultValue: false,
  },
];

const StudyKitTool = () => {
  const { trackToolUsage } = useToolUsage();
  const [file, setFile] = useState<File | null>(null);
  const [optionValues, setOptionValues] = useState<Record<string, string | boolean>>({
    examType: "semester",
    depth: "moderate",
    includeDefinitions: true,
    includeQuestions: true,
    revisionSheet: false,
  });
  const [qualitySettings, setQualitySettings] = useState<QualitySettings>({
    outputLength: "medium",
    tone: "exam",
    bulletPoints: true,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputs, setOutputs] = useState<OutputTab[]>([
    { id: "concepts", label: "Key Concepts", content: "" },
    { id: "definitions", label: "Definitions", content: "" },
    { id: "questions", label: "Important Questions", content: "" },
    { id: "revision", label: "Revision Sheet", content: "" },
  ]);

  // Track tool usage on mount
  useEffect(() => {
    trackToolUsage("/tools/study-kit");
  }, [trackToolUsage]);

  const handleOptionChange = (id: string, value: string | boolean) => {
    setOptionValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenerate = async () => {
    if (!file) return;

    setIsGenerating(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setOutputs([
      {
        id: "concepts",
        label: "Key Concepts",
        content: `📚 KEY CONCEPTS FROM ${file.name.toUpperCase()}

1. FUNDAMENTAL PRINCIPLES
   • Core concept explanation goes here
   • Supporting details and context
   • Related theories and applications

2. IMPORTANT FRAMEWORKS
   • Framework name and description
   • Components and their relationships
   • Practical applications

3. CRITICAL ANALYSIS POINTS
   • Key insights for exam preparation
   • Common misconceptions to avoid
   • Tips for better understanding

💡 Study Tip: Focus on understanding the relationships between these concepts rather than memorizing them in isolation.`,
      },
      {
        id: "definitions",
        label: "Definitions",
        content: `📖 KEY DEFINITIONS

TERM 1: [Definition]
A comprehensive explanation of the first key term with examples and context.

TERM 2: [Definition]
Clear and concise definition with academic framing suitable for exam answers.

TERM 3: [Definition]
Technical definition with practical implications and real-world applications.

✨ Remember: Use these exact definitions in your exam answers for maximum marks.`,
      },
      {
        id: "questions",
        label: "Important Questions",
        content: `❓ PREDICTED IMPORTANT QUESTIONS

SHORT ANSWER (2-3 marks):
1. Define [concept] and explain its significance.
2. List the main characteristics of [topic].
3. Differentiate between [A] and [B].

LONG ANSWER (5-10 marks):
1. Explain the [theory/concept] with suitable examples.
2. Critically analyze the role of [topic] in [context].
3. Discuss the advantages and limitations of [subject].

CASE STUDY:
1. Apply [concept] to solve real-world problems.

📝 Pro Tip: Practice writing answers with time limits for better exam performance.`,
      },
      {
        id: "revision",
        label: "Revision Sheet",
        content: `⚡ ONE-NIGHT REVISION SHEET

🎯 MUST KNOW (High Priority)
━━━━━━━━━━━━━━━━━━━━━━
✓ Point 1: Essential concept
✓ Point 2: Critical formula/definition
✓ Point 3: Key diagram/process

📌 SHOULD KNOW (Medium Priority)
━━━━━━━━━━━━━━━━━━━━━━
• Supporting concept 1
• Supporting concept 2
• Related applications

💡 QUICK FORMULAS
━━━━━━━━━━━━━━━━━━━━━━
Formula 1 = Expression
Formula 2 = Expression

🔗 CONNECTIONS TO REMEMBER
━━━━━━━━━━━━━━━━━━━━━━
Topic A → Topic B → Topic C

⏰ Last-minute tips:
• Review diagrams one more time
• Read definitions out loud
• Get enough sleep!`,
      },
    ]);

    setIsGenerating(false);
  };

  const handleClear = () => {
    setOutputs([
      { id: "concepts", label: "Key Concepts", content: "" },
      { id: "definitions", label: "Definitions", content: "" },
      { id: "questions", label: "Important Questions", content: "" },
      { id: "revision", label: "Revision Sheet", content: "" },
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <ToolLayout
        title="Smart Study Kit Generator"
        description="Transform your exam PDFs into comprehensive study materials with AI-powered analysis."
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      >
        <UploadPanel
          title="Upload Exam PDF"
          description="Upload your study material or past exam paper"
          acceptedTypes={["PDF"]}
          onFileSelect={setFile}
        />

        <div className="flex flex-col gap-4">
          <OptionsPanel
            title="Customize Output"
            options={options}
            values={optionValues}
            onChange={handleOptionChange}
          />
          <AIQualityControls
            settings={qualitySettings}
            onChange={setQualitySettings}
          />
        </div>

        <OutputPanel
          tabs={outputs}
          isLoading={isGenerating}
          onClear={handleClear}
        />
      </ToolLayout>

      <Footer />
    </div>
  );
};

export default StudyKitTool;
