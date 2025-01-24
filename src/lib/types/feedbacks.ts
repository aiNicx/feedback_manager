export interface Feedback {
  id: string
  sender: string
  receiver: string
  question: string
  tags: string[]
  rule: number
}

export interface FeedbackFormData {
  sender: string
  receiver: string
  question: string
}

export interface PreSessionStats {
  totalFeedbacks: number
  avgFeedbacksPerUser: number
  usersWithNoFeedbacks: number
  totalUsers: number
} 