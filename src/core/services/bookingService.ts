import { HotelService } from './hotelService';
import { BookingPolicyService } from './bookingPolicyService';
import { Booking, Id, RoomType } from '../models';
import { BookingRepository } from '../repositories/bookingRepository';

export class BookingService {
	constructor(
		private bookingRepository: BookingRepository,
		private hotelService: HotelService,
		private policyService: BookingPolicyService
	) {}

	book(employeeId: Id, hotelId: Id, roomType: RoomType, checkIn: Date, checkOut: Date) {
		this.checkFacilities(hotelId, roomType);
		this.checkPolicy(employeeId, roomType);
		this.checkAvailability(hotelId, roomType, checkIn, checkOut);
		const booking = Booking.create({ id: Id.generate(), employeeId, hotelId, roomType, checkIn, checkOut });

		this.bookingRepository.createBooking(booking);
		return booking;
	}

	private checkPolicy(employeeId: Id, roomType: RoomType) {
		if (!this.policyService.isBookingAllowed(employeeId, roomType)) {
			throw new Error('The policy does not allow booking');
		}
	}

	private checkFacilities(hotelId: Id, roomType: RoomType) {
		const hotel = this.hotelService.findHotelBy(hotelId);
		if (hotel.isNone()) {
			throw new Error('Hotel is not found');
		}
		if (!hotel.just().hasRoomType(roomType)) {
			throw new Error('Hotel does not provide this type of room');
		}
	}

	private checkAvailability(hotelId: Id, roomType: RoomType, checkIn: Date, checkOut: Date) {
		const hotel = this.hotelService.findHotelBy(hotelId).some();
		const bookings = this.bookingRepository.getBookingsBy(roomType, checkIn, checkOut);
		const areThereNotAvailableRooms = bookings.length >= hotel.getRoomsByType(roomType).length;
		if (areThereNotAvailableRooms) {
			throw new Error('There are not available rooms');
		}
	}
}
