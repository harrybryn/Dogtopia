import { useState, useCallback } from 'react'

/** Manages the list of active habitat tasks for the current session. */
export function useTasks(initialTasks = []) {
  const [tasks, setTasks] = useState(initialTasks)

  const complete = useCallback((taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }, [])

  const add = useCallback((task) => {
    setTasks((prev) => [...prev, task])
  }, [])

  return { tasks, complete, add }
}

