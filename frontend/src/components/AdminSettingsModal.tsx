import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ideasAPI, settingsAPI } from '@/lib/api'
import { HackathonIdea, AppSettings } from '@/types'
import { Trash2, CheckCircle, XCircle } from 'lucide-react'

interface AdminSettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({ open, onOpenChange }) => {
  const [ideas, setIdeas] = useState<HackathonIdea[]>([])
  const [settings, setSettings] = useState<AppSettings>({ requireAdminApproval: false })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadData()
    }
  }, [open])

  const loadData = async () => {
    try {
      setLoading(true)
      const [fetchedIdeas, fetchedSettings] = await Promise.all([
        ideasAPI.getAll(),
        settingsAPI.get()
      ])
      setIdeas(fetchedIdeas)
      setSettings(fetchedSettings)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteIdea = async (ideaId: string) => {
    if (!confirm('Are you sure you want to delete this idea?')) return

    try {
      await ideasAPI.delete(ideaId)
      await loadData()
    } catch (error) {
      console.error('Failed to delete idea:', error)
      alert('Failed to delete idea')
    }
  }

  const handleApprovalToggle = async (ideaId: string, approved: boolean) => {
    try {
      await ideasAPI.updateApproval(ideaId, approved)
      await loadData()
    } catch (error) {
      console.error('Failed to update approval:', error)
      alert('Failed to update approval status')
    }
  }

  const handleSettingsChange = async (key: keyof AppSettings, value: boolean) => {
    try {
      const newSettings = { ...settings, [key]: value }
      await settingsAPI.update(newSettings)
      setSettings(newSettings)
    } catch (error) {
      console.error('Failed to update settings:', error)
      alert('Failed to update settings')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admin Settings</DialogTitle>
          <DialogDescription>
            Manage application settings and hackathon ideas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Application Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>
                Control how the application behaves
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Require Admin Approval</div>
                  <div className="text-sm text-muted-foreground">
                    When enabled, hackathon ideas uploaded by hackers will require admin approval before appearing on the dashboard
                  </div>
                </div>
                <Switch
                  checked={settings.requireAdminApproval}
                  onCheckedChange={(checked) => handleSettingsChange('requireAdminApproval', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Manage Ideas */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Hackathon Ideas</CardTitle>
              <CardDescription>
                View all ideas, approve/unapprove, or delete them
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : ideas.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No ideas found</div>
              ) : (
                <div className="space-y-3">
                  {ideas.map((idea) => (
                    <div
                      key={idea.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{idea.name}</div>
                        <div className="text-sm text-muted-foreground">
                          by {idea.author} • {idea.pages.length} page{idea.pages.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApprovalToggle(idea.id, !idea.approved)}
                          className={idea.approved ? 'text-green-600' : 'text-gray-400'}
                        >
                          {idea.approved ? (
                            <>
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approved
                            </>
                          ) : (
                            <>
                              <XCircle className="mr-1 h-4 w-4" />
                              Not Approved
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteIdea(idea.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
