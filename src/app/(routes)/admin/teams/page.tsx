'use client'

import { TeamsView } from "@/components/teams/teams-view"
import { StatCard } from "@/components/stats/stat-card"
import { useState, useEffect } from "react"
import { queries } from "@/lib/supabase/queries"
import type { Team } from "@/lib/types/teams"

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeams = async () => {
    try {
      setIsLoading(true)
      const data = await queries.teams.getAll()
      setTeams(data)
    } catch (err) {
      console.error('Errore nel caricamento dei team:', err)
      setError('Si è verificato un errore nel caricamento dei team')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  // Calcola le statistiche
  const totalTeams = teams.length
  const projectTeams = teams.filter(t => t.project).length
  const leaderTeams = teams.filter(t => t.isclusterleader).length

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-full px-4 sm:px-8 py-8">
        {/* Header Section */}
        <div className="mb-6 flex items-center">
          <svg
            className="mr-2 h-5 w-5 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <h1 className="text-2xl font-semibold text-gray-900">Gestione Teams</h1>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <StatCard title="TOTALE TEAMS" value={totalTeams} />
          <StatCard title="TEAMS PROGETTO" value={projectTeams} className="bg-blue-100" />
          <StatCard title="TEAMS LEADER" value={leaderTeams} className="bg-green-100" />
        </div>

        <TeamsView 
          teams={teams}
          isLoading={isLoading}
          onSuccess={fetchTeams}
        />
      </main>
    </div>
  )
}
