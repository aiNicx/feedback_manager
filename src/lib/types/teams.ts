export interface Team {
  id: string
  name: string
  project: boolean | null
  leader: { id: string; name: string; surname: string } | null
  team_clusters: Array<{ id: string; cluster: { id: string; name: string } | null }>
  user_teams: Array<{ 
    id: string; 
    user_id: string | null; 
    team_id: string | null; 
    created_at: string | null 
  }>
}

export interface TeamFormData {
  name: string
  project: boolean
  leaderId?: string | null
  clusterId?: string | null
}

export type TeamInsert = Omit<Team, 'id' | 'leader' | 'team_clusters' | 'user_teams'> & {
  leader?: string | null
}

/* 
  Questi tipi verranno utilizzati quando integreremo Supabase
  Per ora li teniamo commentati per evitare errori di ESLint

  import type { Database } from "../supabase/database.types"
  export type TeamInsert = Database['public']['Tables']['teams']['Insert']
  export type TeamUpdate = Database['public']['Tables']['teams']['Update']
*/
