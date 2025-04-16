import { groupBy } from 'lodash-es';

class TimeEntryUtils {
  static groupEntriesByDescription<T extends { description: string }>(
    entries: T[]
  ): Array<{
    description: string;
    entries: T[];
  }> {
    const grouped = groupBy(entries, (entry) => entry.description || 'No description');

    return Object.entries(grouped).map(([description, entries]) => ({
      description,
      entries,
    }));
  }

  static getTimeRangeSummary<T extends { startTime: string; endTime: string | null }>(
    entries: T[]
  ): {
    startDate: string | null;
    endDate: string | null;
    totalDurationMs: number;
  } {
    if (entries.length === 0) {
      return {
        startDate: null,
        endDate: null,
        totalDurationMs: 0,
      };
    }

    const startTimes: Date[] = [];
    const endTimes: Date[] = [];
    let totalDurationMs = 0;

    entries.forEach((entry) => {
      const start = new Date(entry.startTime);
      startTimes.push(start);

      if (entry.endTime) {
        const end = new Date(entry.endTime);
        endTimes.push(end);
        totalDurationMs += end.getTime() - start.getTime();
      }
    });

    const minStartDate = startTimes.length > 0 ? new Date(Math.min(...startTimes.map((d) => d.getTime()))) : null;
    const maxEndDate = endTimes.length > 0 ? new Date(Math.max(...endTimes.map((d) => d.getTime()))) : null;

    return {
      startDate: minStartDate ? minStartDate.toISOString() : null,
      endDate: maxEndDate ? maxEndDate.toISOString() : null,
      totalDurationMs,
    };
  }

  static formatTime(time: string | null): string {
    if (!time) return '--:--';

    const date = new Date(time);
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  static summarizeEntriesDuration<T extends { startTime: string; endTime: string | null }>(entries: T[]): string {
    let totalMs = 0;

    for (const entry of entries) {
      if (!entry.endTime) continue;

      const start = new Date(entry.startTime).getTime();
      const end = new Date(entry.endTime).getTime();
      totalMs += end - start;
    }

    return this.formatDurationMs(totalMs);
  }

  static formatEntryDuration(startTime: string, endTime: string | null): string {
    if (!endTime) return '--:--:--';

    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const diffMs = end - start;

    return this.formatDurationMs(diffMs);
  }

  private static formatDurationMs(diffMs: number): string {
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

export default TimeEntryUtils;
