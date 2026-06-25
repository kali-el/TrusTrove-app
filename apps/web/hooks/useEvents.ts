import { useQuery } from '@tanstack/react-query';
import { getRecentEvents } from '@/lib/api';

export function useRecentEvents(limit?: number) {
  const eventsQuery = useQuery({
    queryKey: ['recentEvents', limit],
    queryFn: () => getRecentEvents(limit),
  });

  return {
    events: eventsQuery.data || [],
    isLoading: eventsQuery.isLoading,
    error: eventsQuery.error,
    refetch: eventsQuery.refetch,
  };
}
