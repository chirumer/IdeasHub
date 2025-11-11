import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Download, Upload as UploadIcon, CheckCircle, AlertCircle, Sparkles, FileText } from 'lucide-react'
import { ideasAPI } from '@/lib/api'

interface CreateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Tab = 'upload' | 'generate'

export const CreateModal: React.FC<CreateModalProps> = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState<Tab>('generate')
  const [uploading, setUploading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [description, setDescription] = useState('')
  const [descriptionFile, setDescriptionFile] = useState<File | null>(null)

  const downloadContext = () => {
    const url = ideasAPI.downloadContextFile()
    const a = document.createElement('a')
    a.href = url
    a.download = 'hackathon-ideas-context.md'
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.zip')) {
      setUploadStatus({ type: 'error', message: 'Please upload a .zip file' })
      return
    }

    setUploading(true)
    setUploadStatus(null)

    try {
      const response = await ideasAPI.upload(file)
      
      const message = response.requiresApproval 
        ? 'Idea uploaded successfully! It will appear after admin approval.'
        : 'Idea uploaded successfully and is now visible on the dashboard!' 
      
      setUploadStatus({ type: 'success', message })
      
      setTimeout(() => {
        onOpenChange(false)
        window.location.reload()
      }, 2000)
    } catch (error) {
      setUploadStatus({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Upload failed'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDescriptionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.name.endsWith('.txt')) {
      setDescriptionFile(file)
      setUploadStatus(null)
    } else if (file) {
      setUploadStatus({ type: 'error', message: 'Please upload a .txt file' })
    }
  }

  const handleGenerate = async () => {
    if (!description.trim() && !descriptionFile) {
      setUploadStatus({ type: 'error', message: 'Please provide a description or upload a .txt file' })
      return
    }

    setGenerating(true)
    setUploadStatus(null)

    try {
      const response = await ideasAPI.generate(description, descriptionFile || undefined)
      
      const message = response.requiresApproval 
        ? 'Idea generated successfully! It will appear after admin approval.'
        : 'Idea generated successfully and is now visible on the dashboard!' 
      
      setUploadStatus({ type: 'success', message })
      
      setTimeout(() => {
        onOpenChange(false)
        setDescription('')
        setDescriptionFile(null)
        window.location.reload()
      }, 2000)
    } catch (error) {
      setUploadStatus({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Generation failed'
      })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Hackathon Idea</DialogTitle>
          <DialogDescription>
            Generate an idea with AI or upload your own structured project
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'generate'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="inline h-4 w-4 mr-2" />
            AI Generate
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <UploadIcon className="inline h-4 w-4 mr-2" />
            Upload ZIP
          </button>
        </div>

        <div className="space-y-6 mt-4">
          {/* AI Generate Tab */}
          {activeTab === 'generate' && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Describe Your Idea</h3>
                  <p className="text-sm text-muted-foreground">
                    Describe your hackathon project idea in detail. AI will generate a complete project with multiple pages.
                  </p>
                  <Textarea
                    placeholder="Example: A mobile app that uses AI to help students find study partners based on their learning style, schedule, and subjects. Should include features like matching algorithm, chat, study session scheduling..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    disabled={generating || !!descriptionFile}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Be specific about features, tech stack, and goals for best results.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t"></div>
                  <span className="text-sm text-muted-foreground">OR</span>
                  <div className="flex-1 border-t"></div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Upload Description File</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a .txt file with your idea description
                  </p>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="description-file"
                      className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 text-center transition-colors hover:border-primary hover:bg-accent flex-1"
                    >
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">
                        {descriptionFile ? descriptionFile.name : 'Choose .txt file'}
                      </span>
                      <input
                        id="description-file"
                        type="file"
                        accept=".txt"
                        onChange={handleDescriptionFileChange}
                        className="hidden"
                        disabled={generating || !!description.trim()}
                      />
                    </label>
                    {descriptionFile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDescriptionFile(null)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={generating || (!description.trim() && !descriptionFile)}
                  className="w-full"
                >
                  {generating ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Idea
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {/* Upload ZIP Tab */}
          {activeTab === 'upload' && (
            <>
              {/* Step 1: Download Context */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                    1
                  </span>
                  Download Context File (Optional)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Download the context file to understand the required structure for your hackathon idea.
                </p>
                <Button onClick={downloadContext} variant="outline" className="w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Download Context File
                </Button>
              </div>

              {/* Step 2: Upload Zip */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                    2
                  </span>
                  Upload Your Idea
                </h3>
                <p className="text-sm text-muted-foreground">
                  Create your idea following the structure, zip the folder, and upload it here.
                </p>
                <div className="flex flex-col gap-4">
                  <label
                    htmlFor="zip-upload"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center transition-colors hover:border-primary hover:bg-accent"
                  >
                    <UploadIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                    <span className="text-sm font-medium">Click to select a zip file</span>
                    <span className="mt-1 text-xs text-muted-foreground">or drag and drop</span>
                    <input
                      id="zip-upload"
                      type="file"
                      accept=".zip"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  
                  {uploading && (
                    <div className="text-center text-sm text-muted-foreground">
                      Uploading and validating...
                    </div>
                  )}
                </div>
              </div>

              {/* Requirements Summary */}
              <div className="rounded-lg border p-4">
                <h4 className="font-semibold mb-2">Quick Requirements:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Zip must contain a single root folder</li>
                  <li>metadata.json with name, description, visibility, and pages</li>
                  <li>pages/ folder with .html files</li>
                  <li>Each HTML file must have at least one &lt;h1&gt; tag</li>
                  <li>HTML files should contain only content (no &lt;html&gt;, &lt;head&gt;, or &lt;body&gt; tags)</li>
                </ul>
              </div>
            </>
          )}

          {/* Status Messages */}
          {uploadStatus && (
            <div
              className={`flex items-start gap-3 rounded-lg border p-4 ${
                uploadStatus.type === 'success'
                  ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200'
                  : 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200'
              }`}
            >
              {uploadStatus.type === 'success' ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {uploadStatus.type === 'success' ? 'Success!' : 'Error'}
                </p>
                <p className="mt-1 text-sm">{uploadStatus.message}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
