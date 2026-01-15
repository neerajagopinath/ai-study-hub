import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { StudyKitUploader } from "@/components/study/StudyKitUploader"
import { StudyHeader } from "@/components/study/StudyHeader"

const StudyKitDirect = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-10 space-y-8">
          <StudyHeader />
          
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Generate AI Study Kit</h2>
              <p className="text-muted-foreground">
                Upload your document and get a comprehensive study kit with exam-ready content
              </p>
            </div>
            
            <StudyKitUploader />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default StudyKitDirect
