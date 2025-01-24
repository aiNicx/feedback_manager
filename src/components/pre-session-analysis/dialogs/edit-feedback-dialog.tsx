'use client'

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import type { Feedback, FeedbackFormData } from "@/lib/types/feedbacks"
import { mockUsersApi } from "@/lib/data/mock-users"
import { mockProcessesApi } from "@/lib/data/mock-processes"

interface EditFeedbackDialogProps {
  feedback: Feedback | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditFeedbackDialog({
  feedback,
  open,
  onOpenChange,
  onSuccess
}: EditFeedbackDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const users = mockUsersApi.getAll()
  const processes = mockProcessesApi.getAll()

  const form = useForm<FeedbackFormData>()

  useEffect(() => {
    if (feedback) {
      form.reset({
        sender: feedback.sender,
        receiver: feedback.receiver,
        question: feedback.question,
      })
    }
  }, [feedback, form])

  const handleSubmit = async (data: FeedbackFormData) => {
    try {
      setIsLoading(true)
      if (!feedback) return

      // Aggiorno il feedback con i nuovi dati
      feedback.sender = data.sender
      feedback.receiver = data.receiver
      feedback.question = data.question
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Errore durante l\'aggiornamento del feedback:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!feedback) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Modifica Feedback</DialogTitle>
        </DialogHeader>
        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="sender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mittente</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona mittente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem 
                            key={user.id} 
                            value={`${user.name} ${user.surname}`}
                          >
                            {user.name} {user.surname}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="receiver"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destinatario</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona destinatario" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem 
                            key={user.id} 
                            value={`${user.name} ${user.surname}`}
                          >
                            {user.name} {user.surname}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domanda</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona domanda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {processes.map((process) => (
                          <SelectItem 
                            key={process.id} 
                            value={process.domanda}
                          >
                            {process.domanda}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salva Modifiche
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
} 