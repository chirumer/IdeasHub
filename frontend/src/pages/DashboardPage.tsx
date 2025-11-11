import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { HackathonIdea, User } from '@/types'
import { ideasAPI } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Calendar, User as UserIcon } from 'lucide-react'

export const DashboardPage: React.FC = () => {
  const [ideas, setIdeas] = useState<HackathonIdea[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()
  const prevUserRef = useRef<User | null>(null)

  useEffect(() => {
    loadIdeas()
  }, [])

  // Refresh ideas list when user logs in (user changes from null to non-null)
  useEffect(() => {
    const prevUser = prevUserRef.current
    prevUserRef.current = user
    
    // Only refresh if user changed from null to logged in
    if (!prevUser && user) {
      loadIdeas()
    }
  }, [user])

  const loadIdeas = async () => {
    try {
      setLoading(true)
      const fetchedIdeas = await ideasAPI.getAll()
      setIdeas(fetchedIdeas)
    } catch (error) {
      console.error('Failed to load ideas:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredIdeas = ideas.filter(idea =>
    idea.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleIdeaClick = (ideaId: string) => {
    navigate(`/idea/${ideaId}`)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8 space-y-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Hackathon Ideas</h1>
          <p className="text-muted-foreground">
            Explore innovative project ideas for your next hackathon
          </p>
        </div>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ideas by name or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredIdeas.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <p>No ideas found. Try adjusting your search.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredIdeas.map((idea) => (
            <Card
              key={idea.id}
              className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
              onClick={() => handleIdeaClick(idea.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl line-clamp-2">{idea.name}</CardTitle>
                  {!idea.approved && (
                    <Badge variant="secondary" className="shrink-0">Pending</Badge>
                  )}
                </div>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <UserIcon className="h-4 w-4" />
                  <span>by {idea.author}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {idea.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {idea.pages.length} {idea.pages.length === 1 ? 'page' : 'pages'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
