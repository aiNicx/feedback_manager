import type { Database } from "../supabase/database.types"

// Tipi dal database Supabase
export type UserTeam = Database['public']['Tables']['user_teams']['Row']
export type UserTeamInsert = Database['public']['Tables']['user_teams']['Insert']
export type UserTeamUpdate = Database['public']['Tables']['user_teams']['Update']

// Tipo esteso con relazioni
export interface Membership extends UserTeam {
  user: {
    id: string
    name: string
    surname: string
    email: string
  } | null
  team: {
    id: string
    name: string
    project: boolean | null
    company: string | null
  } | null
}

// Tipo per il form
export interface MembershipFormData {
  userId: string
  teamId: string
}

/* 
  Questi tipi verranno utilizzati quando integreremo Supabase
  Per ora li teniamo commentati per evitare errori di ESLint

  import type { Database } from "../supabase/database.types"
  export type MembershipInsert = Database['public']['Tables']['user_teams']['Insert']
  export type MembershipUpdate = Database['public']['Tables']['user_teams']['Update']
*/
