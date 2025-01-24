'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TeamForm } from "../forms/team-form"
import type { Team, TeamFormData } from "@/lib/types/teams"
import { queries } from "@/lib/supabase/queries"

interface EditTeamDialogProps {
  team: Team | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditTeamDialog({
  team,
  open,
  onOpenChange,
  onSuccess
}: EditTeamDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: TeamFormData) => {
    try {
      if (!team) return
      
      setIsLoading(true)
      setError(null)

      // Aggiorniamo il team
      await queries.teams.update(team.id, {
        name: data.name.trim(),
        leader: data.leaderId,
        isclusterleader: data.isclusterleader ?? undefined,
        project: data.project
      })

      // Se è stato cambiato il cluster
      if (data.clusterId !== team.team_clusters?.[0]?.cluster?.id) {
        // Prima eliminiamo le associazioni esistenti
        await queries.team_clusters.deleteByTeamId(team.id)
        
        // Se è stato selezionato un nuovo cluster, creiamo la nuova associazione
        if (data.clusterId) {
          await queries.team_clusters.create({
            team_id: team.id,
            cluster_id: data.clusterId
          })
        }
      }
      
      onOpenChange(false)
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      console.error('Errore:', err)
      setError(err instanceof Error ? err.message : 'Errore durante la modifica del team')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      if (!team) return
      
      setIsLoading(true)
      setError(null)

      // Prima eliminiamo le associazioni con i cluster
      await queries.team_clusters.deleteByTeamId(team.id)
      
      // Poi eliminiamo il team
      await queries.teams.delete(team.id)
      
      onOpenChange(false)
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      console.error('Errore:', err)
      setError(err instanceof Error ? err.message : 'Errore durante l\'eliminazione del team')
    } finally {
      setIsLoading(false)
    }
  }

  if (!team) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifica Team</DialogTitle>
        </DialogHeader>
        <div className="mt-6">
          {error && (
            <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          <TeamForm
            initialData={{
              name: team.name,
              clusterId: team.team_clusters?.[0]?.cluster?.id || null,
              leaderId: team.leader?.id || null,
              isclusterleader: team.isclusterleader ?? undefined,
              project: team.project ?? false
            }}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            isLoading={isLoading}
            mode="edit"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
