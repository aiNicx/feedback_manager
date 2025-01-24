'use client'

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from '@tanstack/react-query'
import { queries } from '@/lib/supabase/queries'
import type { MembershipFormData } from "@/lib/types/memberships"

interface MembershipFormProps {
  onSubmit: (data: MembershipFormData) => void
  onDelete?: () => void
  isLoading?: boolean
  mode?: 'create' | 'edit'
  initialData?: MembershipFormData
}

export function MembershipForm({
  onSubmit,
  onDelete,
  isLoading,
  mode = 'create',
  initialData
}: MembershipFormProps) {
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: queries.users.getAll
  })

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: queries.teams.getAll
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    onSubmit({
      userId: formData.get('userId') as string,
      teamId: formData.get('teamId') as string
    })
  }

  // Ordina gli utenti per nome e cognome
  const sortedUsers = [...users].sort((a, b) => 
    `${a.name} ${a.surname}`.localeCompare(`${b.name} ${b.surname}`)
  )

  // Ordina i team per nome
  const sortedTeams = [...teams].sort((a, b) => 
    a.name.localeCompare(b.name)
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Select name="userId" defaultValue={initialData?.userId}>
          <SelectTrigger>
            <SelectValue placeholder="Seleziona utente" />
          </SelectTrigger>
          <SelectContent>
            {sortedUsers.map(user => (
              <SelectItem key={user.id} value={user.id}>
                {user.name} {user.surname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Select name="teamId" defaultValue={initialData?.teamId}>
          <SelectTrigger>
            <SelectValue placeholder="Seleziona team" />
          </SelectTrigger>
          <SelectContent>
            {sortedTeams.map(team => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between">
        <Button type="submit" disabled={isLoading}>
          {mode === 'create' ? 'Crea' : 'Salva'}
        </Button>
        {mode === 'edit' && onDelete && (
          <Button 
            type="button" 
            variant="destructive" 
            disabled={isLoading}
            onClick={onDelete}
          >
            Elimina
          </Button>
        )}
      </div>
    </form>
  )
}
