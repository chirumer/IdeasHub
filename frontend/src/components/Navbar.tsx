import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeSelector } from '@/components/ThemeSelector'
import { CreateModal } from '@/components/CreateModal'
import { AdminSettingsModal } from '@/components/AdminSettingsModal'
import { LoginModal } from '@/components/LoginModal'
import { Lightbulb, ChevronDown, Plus, Settings, LogOut, LogIn } from 'lucide-react'
import { ideasAPI } from '@/lib/api'
import { HackathonIdea } from '@/types'
import { Input } from './ui/input'

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [adminModalOpen, setAdminModalOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [ideaSearchQuery, setIdeaSearchQuery] = useState('')
  const [ideas, setIdeas] = useState<HackathonIdea[]>([])

  useEffect(() => {
    const loadIdeas = async () => {
      try {
        const fetchedIdeas = await ideasAPI.getAll()
        setIdeas(fetchedIdeas)
      } catch (error) {
        console.error('Failed to load ideas:', error)
      }
    }

    loadIdeas()
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleLogoClick = () => {
    navigate('/dashboard')
  }

  const filteredIdeas = ideas.filter(idea =>
    idea.name.toLowerCase().includes(ideaSearchQuery.toLowerCase()) ||
    idea.description.toLowerCase().includes(ideaSearchQuery.toLowerCase())
  )

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity"
            >
              <div className="rounded-full bg-primary/10 p-2">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <span className="hidden sm:inline">HackIdeas</span>
            </button>

            {/* Ideas Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Browse Ideas
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 max-h-[400px] overflow-y-auto">
                <div className="p-2">
                  <Input
                    placeholder="Search ideas..."
                    value={ideaSearchQuery}
                    onChange={(e) => setIdeaSearchQuery(e.target.value)}
                    className="h-8"
                  />
                </div>
                <DropdownMenuSeparator />
                {filteredIdeas.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    No ideas found
                  </div>
                ) : (
  filteredIdeas.map((idea) => (
                    <DropdownMenuItem
                      key={idea.id}
                      onClick={() => navigate(`/idea/${idea.id}`)}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{idea.name}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">{idea.description}</span>
                        <span className="text-xs text-muted-foreground">by {idea.author}</span>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

          </div>

          <div className="flex items-center gap-3">
            {/* Theme Selector */}
            <ThemeSelector />

            {/* Upload Button - only when logged in */}
            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCreateModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Create</span>
              </Button>
            )}

            {/* Admin Settings */}
            {user?.role === 'admin' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAdminModalOpen(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            )}

            {/* User Menu or Login Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {user.username}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user.username}
                    <div className="text-xs text-muted-foreground">{user.role}</div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => setLoginModalOpen(true)}
              >
                <LogIn className="h-4 w-4 mr-2" />
                <span>Login</span>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Modals */}
      {user && <CreateModal open={createModalOpen} onOpenChange={setCreateModalOpen} />}
      {user?.role === 'admin' && <AdminSettingsModal open={adminModalOpen} onOpenChange={setAdminModalOpen} />}
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </>
  )
}
