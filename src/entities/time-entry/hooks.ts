import {
  InfiniteData,
  QueryClient,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import TimeEntryApi from '@entities/time-entry/api';
import { ENTRIES_LIMIT } from '@entities/time-entry/constants';
import { PaginatedResponse, TimeEntry, TimeEntryGroup } from '@entities/time-entry/types';

export { ENTRIES_LIMIT } from '@entities/time-entry/constants';

enum TimeEntryQueryKeys {
  TIME_ENTRIES = 'time-entries',
  ACTIVE_TIME_ENTRY = 'time-entries/active',
  GROUP_ENTRIES = 'time-entries/group-entries',
}

async function invalidateTimeEntryQueries(queryClient: QueryClient): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: [TimeEntryQueryKeys.TIME_ENTRIES] }),
    queryClient.invalidateQueries({ queryKey: [TimeEntryQueryKeys.ACTIVE_TIME_ENTRY] }),
    queryClient.invalidateQueries({ queryKey: [TimeEntryQueryKeys.GROUP_ENTRIES] }),
  ]);
}

export function useGetTimeEntriesQuery(
  page: number,
  limit: number,
  options?: Omit<UseQueryOptions<PaginatedResponse<TimeEntryGroup>>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [TimeEntryQueryKeys.TIME_ENTRIES, page, limit],
    queryFn: () => TimeEntryApi.getAll(page, limit),
    ...options,
  });
}

export function useGetGroupEntriesInfiniteQuery(
  groupId: string,
  options?: Omit<
    UseInfiniteQueryOptions<
      PaginatedResponse<TimeEntry>,
      Error,
      InfiniteData<PaginatedResponse<TimeEntry>>,
      PaginatedResponse<TimeEntry>,
      unknown[],
      number
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >
): UseInfiniteQueryResult<InfiniteData<PaginatedResponse<TimeEntry>>, Error> {
  return useInfiniteQuery({
    queryKey: [TimeEntryQueryKeys.GROUP_ENTRIES, groupId],
    queryFn: ({ pageParam }) => TimeEntryApi.getGroupEntries(groupId, pageParam, ENTRIES_LIMIT),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.page * lastPage.limit;
      return loaded < lastPage.total ? lastPage.page + 1 : undefined;
    },
    ...options,
  });
}

export function useGetActiveTimeEntryQuery(options?: Omit<UseQueryOptions<TimeEntry>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: [TimeEntryQueryKeys.ACTIVE_TIME_ENTRY],
    queryFn: () => TimeEntryApi.getActive(),
    ...options,
  });
}

export function useCreateTimeEntryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (description: string) => TimeEntryApi.create(description),
    onSuccess: () => invalidateTimeEntryQueries(queryClient),
  });
}

export function useStopTimeEntryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => TimeEntryApi.stop(id),
    onSuccess: () => invalidateTimeEntryQueries(queryClient),
  });
}

export function useDeleteTimeEntryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => TimeEntryApi.delete(id),
    onSuccess: () => invalidateTimeEntryQueries(queryClient),
  });
}
