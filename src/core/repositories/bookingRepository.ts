import { Booking, RoomType } from '../models';

export class BookingRepository {
	constructor(private bookings: Booking[] = []) {}

	getBookingsBy(roomType: RoomType, checkIn: Date, checkOut: Date): Booking[] {
		return this.bookings
			.filter((booking) => booking.roomType === roomType)
			.filter(
				(booking) =>
					(booking.checkIn >= checkIn && booking.checkIn <= checkOut) ||
					(booking.checkOut >= checkIn && booking.checkOut <= checkOut)
			);
	}

	createBooking(booking: Booking) {
		this.bookings.push(booking);
	}
}
