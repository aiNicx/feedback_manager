'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { teamSchema } from "./team-schema"
import type { TeamFormData } from "@/lib/types/teams"
import { queries } from "@/lib/supabase/queries"
import { useEffect, useState } from "react"

interface TeamFormProps {
  onSubmit: (data: TeamFormData) => void
  onDelete?: () => void
  isLoading?: boolean
  initialData?: TeamFormData
  mode?: 'create' | 'edit'
}

interface Leader {
  id: string
  name: string
  surname: string
}

interface Cluster {
  id: string
  name: string
}

export function TeamForm({
  onSubmit,
  onDelete,
  isLoading,
  initialData,
  mode = 'create'
}: TeamFormProps) {
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      clusterId: initialData?.clusterId ?? null,
      leaderId: initialData?.leaderId ?? null,
      project: initialData?.project ?? false
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true)
        
        // Carica tutti gli utenti come potenziali leader
        const users = await queries.users.getAll()
        setLeaders(users.map(user => ({
          id: user.id,
          name: user.name,
          surname: user.surname
        })))

        // Carica i cluster disponibili
        const clustersData = await queries.clusters.getAll()
        setClusters(clustersData.map(cluster => ({
          id: cluster.id,
          name: cluster.name
        })))
      } catch (err) {
        console.error('Errore nel caricamento dei dati:', err)
        setError('Si è verificato un errore nel caricamento dei dati')
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [])

  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
      </div>
    )
  }

  if (isLoadingData) {
    return (
      <div className="p-4 text-gray-500">
        Caricamento dati in corso...
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Team</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nome del team" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clusterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cluster</FormLabel>
              <Select
                value={field.value ?? "none"}
                onValueChange={(value) => field.onChange(value === "none" ? null : value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona un cluster" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Nessun cluster</SelectItem>
                  {clusters.map((cluster) => (
                    <SelectItem key={cluster.id} value={cluster.id}>
                      {cluster.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="leaderId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Leader</FormLabel>
              <Select
                value={field.value ?? "none"}
                onValueChange={(value) => field.onChange(value === "none" ? null : value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona un leader" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Nessun leader</SelectItem>
                  {leaders.map((leader) => (
                    <SelectItem key={leader.id} value={leader.id}>
                      {leader.name} {leader.surname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="project"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">
                Questo team è un progetto?
              </FormLabel>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4 pt-4">
          {mode === 'edit' && onDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              disabled={isLoading}
            >
              Elimina
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {mode === 'create' ? 'Crea Team' : 'Salva'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
