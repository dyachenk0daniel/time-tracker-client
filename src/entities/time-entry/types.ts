export interface TimeEntryResponse {
  id: string;
  userId: string;
  description: string;
  startTime: string;
  endTime: string | null;
  createdAt: string;
  updatedAt: string | null;
}
