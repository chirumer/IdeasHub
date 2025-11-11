import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { HackathonIdea } from '@/types'
import { ideasAPI } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, User, Calendar, Plus, Settings as SettingsIcon, Trash2, Loader2, AlertCircle } from 'lucide-react'

export const IdeaViewerPage: React.FC = () => {
  const { ideaId } = useParams<{ ideaId: string }>()
  const [idea, setIdea] = useState<HackathonIdea | null>(null)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // Modal states
  const [addPageModalOpen, setAddPageModalOpen] = useState(false)
  const [managePagesModalOpen, setManagePagesModalOpen] = useState(false)
  const [deleteIdeaDialogOpen, setDeleteIdeaDialogOpen] = useState(false)
  const [deletePageConfirmOpen, setDeletePageConfirmOpen] = useState(false)
  const [pageToDelete, setPageToDelete] = useState<string | null>(null)
  
  // Form states
  const [pageTitle, setPageTitle] = useState('')
  const [pageDescription, setPageDescription] = useState('')
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadIdea()
  }, [ideaId])

  const loadIdea = async () => {
    if (!ideaId) {
      navigate('/dashboard')
      return
    }

    try {
      setLoading(true)
      const fetchedIdea = await ideasAPI.getById(ideaId)
      setIdea(fetchedIdea)
    } catch (error) {
      console.error('Failed to load idea:', error)
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleAddPage = async () => {
    if (!pageTitle.trim() || !pageDescription.trim()) {
      setError('Both title and description are required')
      return
    }

    try {
      setAdding(true)
      setError('')
      await ideasAPI.addPage(ideaId!, pageTitle, pageDescription)
      await loadIdea()
      setAddPageModalOpen(false)
      setPageTitle('')
      setPageDescription('')
    } catch (error: any) {
      setError(error.message || 'Failed to add page')
    } finally {
      setAdding(false)
    }
  }

  const handleDeletePage = async () => {
    if (!pageToDelete) return

    try {
      setDeleting(true)
      await ideasAPI.deletePage(ideaId!, pageToDelete)
      await loadIdea()
      setDeletePageConfirmOpen(false)
      setPageToDelete(null)
      if (currentPageIndex >= idea!.pages.length - 1) {
        setCurrentPageIndex(Math.max(0, idea!.pages.length - 2))
      }
    } catch (error: any) {
      alert(error.message || 'Failed to delete page')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteIdea = async () => {
    try {
      setDeleting(true)
      await ideasAPI.delete(ideaId!)
      navigate('/dashboard')
    } catch (error: any) {
      alert(error.message || 'Failed to delete idea')
      setDeleting(false)
    }
  }

  const confirmDeletePage = (filename: string) => {
    setPageToDelete(filename)
    setDeletePageConfirmOpen(true)
  }

  if (!idea) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p>Loading...</p>
      </div>
    )
  }

  const currentPage = idea.pages[currentPageIndex]
  const isAuthor = user?.username === idea.author
  const canDelete = isAuthor || user?.role === 'admin'

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold mb-3">{idea.name}</h1>
            <p className="text-lg text-muted-foreground mb-4">{idea.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>by {idea.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
              </div>
              {!idea.approved && (
                <Badge variant="secondary">Pending Approval</Badge>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {idea.pages.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {idea.pages.map((page, index) => (
                  <Button
                    key={index}
                    variant={currentPageIndex === index ? 'default' : 'outline'}
                    onClick={() => setCurrentPageIndex(index)}
                    size="sm"
                  >
                    {page.title}
                  </Button>
                ))}
              </div>
            )}
            
            {isAuthor && (
              <>
                <div className="flex-grow" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAddPageModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Page
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setManagePagesModalOpen(true)}
                >
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Manage Pages
                </Button>
              </>
            )}
            
            {canDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteIdeaDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Idea
              </Button>
            )}
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div 
            className="prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: currentPage.content }}
          />
        </CardContent>
      </Card>

      {/* Add Page Modal */}
      <Dialog open={addPageModalOpen} onOpenChange={setAddPageModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Page with AI</DialogTitle>
            <DialogDescription>
              Describe what you want the page to cover, and AI will generate the content for you.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Page Title</label>
              <Input
                placeholder="e.g., Technical Architecture"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">What should this page cover?</label>
              <Textarea
                placeholder="Describe what content you want in this page. Be specific - the AI will generate detailed content based on your description."
                value={pageDescription}
                onChange={(e) => setPageDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddPageModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPage} disabled={adding}>
              {adding && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {adding ? 'Generating...' : 'Generate Page'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Pages Modal */}
      <Dialog open={managePagesModalOpen} onOpenChange={setManagePagesModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Pages</DialogTitle>
            <DialogDescription>
              Delete pages you no longer need. An idea must have at least one page.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {idea.pages.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                <span className="font-medium">{page.title}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setManagePagesModalOpen(false)
                    confirmDeletePage(page.filename)
                  }}
                  disabled={idea.pages.length === 1}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Page Confirmation */}
      <Dialog open={deletePageConfirmOpen} onOpenChange={setDeletePageConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Page?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this page? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletePageConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePage} disabled={deleting}>
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {deleting ? 'Deleting...' : 'Delete Page'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Idea Confirmation */}
      <Dialog open={deleteIdeaDialogOpen} onOpenChange={setDeleteIdeaDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Idea?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{idea.name}"? This will permanently delete all pages and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteIdeaDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteIdea} disabled={deleting}>
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {deleting ? 'Deleting...' : 'Delete Idea'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
