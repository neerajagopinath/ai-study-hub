import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { UploadPanel } from "@/components/tool/UploadPanel";
import { OptionsPanel, ToolOption } from "@/components/tool/OptionsPanel";
import { OutputPanel, OutputTab } from "@/components/tool/OutputPanel";

const options: ToolOption[] = [
  {
    id: "mode",
    label: "Presentation Mode",
    type: "select",
    options: [
      { value: "seminar", label: "Seminar Presentation" },
      { value: "viva", label: "Viva Voce" },
      { value: "defense", label: "Project Defense" },
    ],
  },
  {
    id: "noteStyle",
    label: "Notes Style",
    type: "select",
    options: [
      { value: "brief", label: "Brief Bullet Points" },
      { value: "detailed", label: "Detailed Scripts" },
      { value: "conversational", label: "Conversational" },
    ],
  },
  {
    id: "includeViva",
    label: "Generate Viva Questions",
    type: "toggle",
    defaultValue: true,
  },
  {
    id: "timingGuide",
    label: "Include Timing Guide",
    type: "toggle",
    defaultValue: false,
  },
];

const SpeakerNotesTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [optionValues, setOptionValues] = useState<Record<string, string | boolean>>({
    mode: "seminar",
    noteStyle: "detailed",
    includeViva: true,
    timingGuide: false,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputs, setOutputs] = useState<OutputTab[]>([
    { id: "notes", label: "Speaker Notes", content: "" },
    { id: "viva", label: "Viva Questions", content: "" },
    { id: "tips", label: "Presentation Tips", content: "" },
  ]);

  const handleOptionChange = (id: string, value: string | boolean) => {
    setOptionValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenerate = async () => {
    if (!file) return;

    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setOutputs([
      {
        id: "notes",
        label: "Speaker Notes",
        content: `🎤 SPEAKER NOTES FOR ${file.name.toUpperCase()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SLIDE 1: Introduction (2 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Good morning everyone. Today I'll be presenting on [topic]..."

Key Points to Cover:
• Introduce yourself and the topic
• State the objectives of your presentation
• Give a brief overview of what's coming

💡 Tip: Make eye contact and speak slowly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SLIDE 2: Background (3 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Let me start by explaining the context..."

Key Points to Cover:
• Historical context or problem statement
• Why this topic matters
• Current state of research/practice

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SLIDE 3: Main Content (5 min)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Now, let's dive into the core concepts..."

Key Points to Cover:
• Main argument or methodology
• Supporting evidence
• Examples and illustrations

🔊 Voice modulation: Emphasize key terms`,
      },
      {
        id: "viva",
        label: "Viva Questions",
        content: `❓ POTENTIAL VIVA QUESTIONS

🔴 HIGH PROBABILITY QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Q1: "What motivated you to choose this topic?"
Suggested Answer: Explain personal interest + academic relevance + practical applications.

Q2: "What are the limitations of your approach?"
Suggested Answer: Acknowledge limitations honestly, then explain mitigation strategies.

Q3: "How does this compare to existing solutions?"
Suggested Answer: Highlight unique contributions while respecting prior work.

🟡 MODERATE PROBABILITY QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Q4: "Can you explain [specific technical concept]?"
Q5: "What would you do differently if you started over?"
Q6: "What are the future directions for this work?"

🟢 FOLLOW-UP QUESTIONS TO PREPARE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Questions about methodology
• Questions about data sources
• Questions about practical implementation`,
      },
      {
        id: "tips",
        label: "Presentation Tips",
        content: `✨ PRESENTATION TIPS

BEFORE THE PRESENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Practice at least 3 times
✓ Time yourself for each slide
✓ Prepare backup explanations
✓ Test your equipment
✓ Arrive early

DURING THE PRESENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Start with a confident greeting
✓ Maintain eye contact
✓ Speak at a measured pace
✓ Pause between key points
✓ Use hand gestures naturally
✓ Engage with your audience

HANDLING QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Listen carefully before answering
✓ It's okay to say "I'll need to research that"
✓ Stay calm and composed
✓ Thank the questioner

BODY LANGUAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Stand tall with open posture
✓ Don't cross your arms
✓ Smile naturally
✓ Move purposefully, not nervously

💪 You've got this!`,
      },
    ]);

    setIsGenerating(false);
  };

  const handleClear = () => {
    setOutputs([
      { id: "notes", label: "Speaker Notes", content: "" },
      { id: "viva", label: "Viva Questions", content: "" },
      { id: "tips", label: "Presentation Tips", content: "" },
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <ToolLayout
        title="Speaker Notes & Viva Prep"
        description="Convert your presentations into detailed speaker notes with AI-generated viva questions."
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      >
        <UploadPanel
          title="Upload Presentation"
          description="Upload your PPT or PPTX file"
          acceptedTypes={["PPT", "PPTX"]}
          onFileSelect={setFile}
        />

        <OptionsPanel
          title="Customize Output"
          options={options}
          values={optionValues}
          onChange={handleOptionChange}
        />

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

export default SpeakerNotesTool;
