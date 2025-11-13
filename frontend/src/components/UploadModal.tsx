import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, Upload as UploadIcon, CheckCircle, AlertCircle } from 'lucide-react'
import { ideasAPI } from '@/lib/api'

interface UploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const UploadModal: React.FC<UploadModalProps> = ({ open, onOpenChange }) => {
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const downloadContext = () => {
    const url = ideasAPI.downloadContextFile()
    const a = document.createElement('a')
    a.href = url
    a.download = 'ideas-context.md'
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Idea</DialogTitle>
          <DialogDescription>
            Follow the structure guidelines and upload your idea as a zip file
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Download Context */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                1
              </span>
              Download Template File (Optional)
            </h3>
            <p className="text-sm text-muted-foreground">
              Download the template file to understand the required structure for your idea.
            </p>
            <Button onClick={downloadContext} variant="outline" className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Download Template File
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
          </div>

          {/* Requirements Summary */}
          <div className="rounded-lg border p-4">
            <h4 className="font-semibold mb-2">Quick Requirements:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Zip must contain a single root folder</li>
              <li>metadata.json with name, description, visibility, ideaType, and pages</li>
              <li>ideaType must be one of: "Hackathon idea", "Project idea", "Resume project idea"</li>
              <li>pages/ folder with .html files</li>
              <li>Each HTML file must have at least one &lt;h1&gt; tag</li>
              <li>HTML files should contain only content (no &lt;html&gt;, &lt;head&gt;, or &lt;body&gt; tags)</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
