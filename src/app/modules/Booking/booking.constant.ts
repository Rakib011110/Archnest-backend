export const BOOKING_STATUS = { PENDING: 'PENDING', CONFIRMED: 'CONFIRMED', CANCELLED: 'CANCELLED', COMPLETED: 'COMPLETED' } as const;
export type TBookingStatus = keyof typeof BOOKING_STATUS;

export const BOOKING_MEETING_TYPE = { OFFICE: 'OFFICE', ONLINE: 'ONLINE' } as const;
export type TBookingMeetingType = keyof typeof BOOKING_MEETING_TYPE;
