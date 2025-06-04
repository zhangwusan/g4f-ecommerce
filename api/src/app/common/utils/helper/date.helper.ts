export type TimeRangeType = 'daily' | 'monthly' | 'weekly' | 'yearly' | 'custom';

export interface DateRangeParams {
  type?: TimeRangeType;              // 'month' is the default
  customStartDate?: Date;           // required if type = 'custom'
  customEndDate?: Date;             // required if type = 'custom'
  now?: Date;                       // optional, useful for testing or static dates
}

export function getDateRange({
  type = 'monthly',
  customStartDate,
  customEndDate,
  now = new Date(), // use current date unless overridden
}: DateRangeParams = {}) {
  switch (type) {
    case 'daily':
      return {
        startDate: new Date(now.setHours(0, 0, 0, 0)),
        endDate: new Date(now.setHours(23, 59, 59, 999)),
      };
      
    case 'monthly':
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      };

    case 'weekly': {
      const day = now.getDay(); // 0 (Sun) to 6 (Sat)
      const diffToMonday = (day + 6) % 7; // Make Monday = 0
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - diffToMonday);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);

      return { startDate, endDate };
    }

    case 'yearly':
      return {
        startDate: new Date(now.getFullYear(), 0, 1),
        endDate: new Date(now.getFullYear(), 11, 31),
      };

    case 'custom':
      if (!customStartDate || !customEndDate) {
        throw new Error('Custom date range requires both customStartDate and customEndDate.');
      }
      return { startDate: customStartDate, endDate: customEndDate };

    default:
      throw new Error(`Unsupported date range type: ${type}`);
  }
}