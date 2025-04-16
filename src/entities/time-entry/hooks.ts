import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import TimeEntryApi from '@entities/time-entry/api';
import { CreateTimeEntry } from '@entities/time-entry/types';

enum TimeEntryQueryKeys {
  TIME_ENTRIES = 'time-entries',
  ACTIVE_TIME_ENTRY = 'time-entries/active',
}

export function useGetTimeEntriesQuery() {
  return useQuery({
    queryKey: [TimeEntryQueryKeys.TIME_ENTRIES],
    queryFn: () => TimeEntryApi.getAll(),
  });
}

export function useCreateTimeEntryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTimeEntry) => TimeEntryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TimeEntryQueryKeys.TIME_ENTRIES], exact: true });
      queryClient.invalidateQueries({ queryKey: [TimeEntryQueryKeys.ACTIVE_TIME_ENTRY], exact: true });
    },
  });
}

export function useGetActiveTimeEntryQuery() {
  return useQuery({
    queryKey: [TimeEntryQueryKeys.ACTIVE_TIME_ENTRY],
    queryFn: () => TimeEntryApi.getActive(),
  });
}

export function useStopTimeEntryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => TimeEntryApi.stop(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TimeEntryQueryKeys.TIME_ENTRIES], exact: true });
      queryClient.invalidateQueries({ queryKey: [TimeEntryQueryKeys.ACTIVE_TIME_ENTRY], exact: true });
    },
  });
}
