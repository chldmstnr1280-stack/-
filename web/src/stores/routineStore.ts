import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompletedRoutine {
  routineId: string;
  completedAt: Date;
  rating?: number;
}

interface RoutineState {
  completedRoutines: CompletedRoutine[];
  completeRoutine: (routineId: string, rating?: number) => void;
  getCompletedCount: () => number;
  getAverageRating: () => number;
  clear: () => void;
}

export const useRoutineStore = create<RoutineState>()(
  persist(
    (set, get) => ({
      completedRoutines: [],
      completeRoutine: (routineId, rating) => {
        const completed: CompletedRoutine = {
          routineId,
          completedAt: new Date(),
          rating,
        };
        set((state) => ({
          completedRoutines: [...state.completedRoutines, completed],
        }));
      },
      getCompletedCount: () => get().completedRoutines.length,
      getAverageRating: () => {
        const routines = get().completedRoutines;
        const rated = routines.filter((r) => r.rating !== undefined);
        if (rated.length === 0) return 0;
        const sum = rated.reduce((acc, r) => acc + (r.rating || 0), 0);
        return sum / rated.length;
      },
      clear: () => set({ completedRoutines: [] }),
    }),
    {
      name: 'sellery-routines',
    }
  )
);
