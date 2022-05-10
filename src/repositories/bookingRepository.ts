import { Booking, RoomType } from '../core/models';

export class BookingRepository {
	getBookingsBy(roomType: RoomType, checkIn: Date, checkOut: Date): Booking[] {
		return [];
	}

	createBooking(booking: Booking) {}
}
