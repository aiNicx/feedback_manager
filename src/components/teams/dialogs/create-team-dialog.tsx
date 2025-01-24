'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TeamForm } from "../forms/team-form"
import type { TeamFormData } from "@/lib/types/teams"
import { queries } from "@/lib/supabase/queries"

interface CreateTeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateTeamDialog({
  open,
  onOpenChange,
  onSuccess
}: CreateTeamDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: TeamFormData) => {
    try {
      setIsLoading(true)
      setError(null)
      
      if (!data.name?.trim()) {
        throw new Error('Il nome del team è obbligatorio')
      }

      // Recuperiamo la prima company disponibile
      const companies = await queries.companies.getAll()
      if (!companies || companies.length === 0) {
        throw new Error('Nessuna company disponibile nel sistema')
      }
      const defaultCompany = companies[0].id

      console.log('Dati del team da creare:', {
        name: data.name.trim(),
        leader: data.leaderId || null,
        project: data.project,
        company: defaultCompany
      })

      // Creiamo prima il team
      const newTeam = await queries.teams.create({
        name: data.name.trim(),
        leader: data.leaderId || null,
        project: data.project,
        company: defaultCompany
      })

      console.log('Team creato:', newTeam)

      // Se è stato selezionato un cluster, creiamo l'associazione
      if (data.clusterId && newTeam) {
        console.log('Creazione associazione cluster:', {
          team_id: newTeam.id,
          cluster_id: data.clusterId
        })
        await queries.team_clusters.create({
          team_id: newTeam.id,
          cluster_id: data.clusterId
        })
      }
      
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      console.error('Errore dettagliato:', err)
      if (err instanceof Error) {
        console.error('Message:', err.message)
        console.error('Stack:', err.stack)
      }
      setError(err instanceof Error ? err.message : 'Errore durante la creazione del team')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crea Team</DialogTitle>
        </DialogHeader>
        <div className="mt-6">
          {error && (
            <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          <TeamForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            mode="create"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
