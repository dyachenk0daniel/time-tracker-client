import { TimeEntryResponse } from '@entities/time-entry/types.ts';
import apiClient from '@shared/api/api-client.ts';

class TimeEntryApi {
  static async getAll(): Promise<TimeEntryResponse[]> {
    const response = await apiClient.get<TimeEntryResponse[]>('/time-entries');

    return response.data;
  }

  static async create(description: string): Promise<TimeEntryResponse> {
    const response = await apiClient.post<TimeEntryResponse>('/time-entries', { description });

    return response.data;
  }

  static async getActive(): Promise<TimeEntryResponse> {
    const response = await apiClient.get<TimeEntryResponse>('/time-entries/active');

    return response.data;
  }

  static async stop(id: string): Promise<TimeEntryResponse> {
    const response = await apiClient.put<TimeEntryResponse>(`/time-entries/${id}/stop`);

    return response.data;
  }
}

export default TimeEntryApi;
