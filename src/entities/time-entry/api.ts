import { PaginatedResponse, TimeEntryGroup, TimeEntry } from '@entities/time-entry/types.ts';
import apiClient from '@shared/api/api-client.ts';

class TimeEntryApi {
  static async getAll(page: number, limit: number): Promise<PaginatedResponse<TimeEntryGroup>> {
    const response = await apiClient.get<PaginatedResponse<TimeEntryGroup>>('/time-entries', {
      params: { page, limit },
    });

    return response.data;
  }

  static async getGroupEntries(groupId: string, page: number, limit: number): Promise<PaginatedResponse<TimeEntry>> {
    const response = await apiClient.get<PaginatedResponse<TimeEntry>>(`/time-entries/${groupId}/entries`, {
      params: { page, limit },
    });

    return response.data;
  }

  static async create(description: string): Promise<TimeEntry> {
    const response = await apiClient.post<TimeEntry>('/time-entries', { description });

    return response.data;
  }

  static async getActive(): Promise<TimeEntry> {
    const response = await apiClient.get<TimeEntry>('/time-entries/active');

    return response.data;
  }

  static async stop(id: string): Promise<TimeEntry> {
    const response = await apiClient.put<TimeEntry>(`/time-entries/${id}/stop`);

    return response.data;
  }

  static async delete(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/time-entries/${id}`);

    return response.data;
  }
}

export default TimeEntryApi;
