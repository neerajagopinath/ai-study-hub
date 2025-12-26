import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FileProvider } from "@/contexts/FileContext";
import { FocusModeProvider } from "@/components/tool/FocusMode";
import Index from "./pages/Index";
import Tools from "./pages/Tools";
import About from "./pages/About";
import StudyKitTool from "./pages/StudyKitTool";
import SpeakerNotesTool from "./pages/SpeakerNotesTool";
import SummarizerTool from "./pages/SummarizerTool";
import PredictiveTool from "./pages/PredictiveTool";
import OptimizerTool from "./pages/OptimizerTool";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FileProvider>
        <FocusModeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/about" element={<About />} />
              <Route path="/tools/study-kit" element={<StudyKitTool />} />
              <Route path="/tools/speaker-notes" element={<SpeakerNotesTool />} />
              <Route path="/tools/summarizer" element={<SummarizerTool />} />
              <Route path="/tools/predictive" element={<PredictiveTool />} />
              <Route path="/tools/optimizer" element={<OptimizerTool />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </FocusModeProvider>
      </FileProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
