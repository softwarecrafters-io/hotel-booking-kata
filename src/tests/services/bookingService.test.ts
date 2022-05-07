import { HotelService } from '../../core/services/hotelService';
import { BookingPolicyService } from '../../core/services/bookingPolicyService';
import { HotelRepository } from '../../core/repositories/hotelRepository';
import { BookingPolicyRepository } from '../../core/repositories/bookingPolicyRepository';
import { CompanyRepository } from '../../core/repositories/companyRepository';
import { Hotel, Id, Room, RoomType } from '../../core/models';
import { createStubWithExistingHotel } from '../factory';
import { Maybe } from 'monet';

class BookingRepository {
	createBooking(booking: Booking) {}
}

class BookingService {
	constructor(
		private bookingRepository: BookingRepository,
		private hotelService: HotelService,
		private policyService: BookingPolicyService
	) {}

	book(employeeId: Id, hotelId: Id, roomType: RoomType, checkIn: Date, checkOut: Date) {
		const booking = Booking.create({ id: Id.generate(), employeeId, hotelId, roomType, checkIn, checkOut });

		this.bookingRepository.createBooking(booking);
		return booking;
	}
}

class Booking {
	constructor(
		readonly id: Id,
		readonly employeeId: Id,
		readonly hotelId: Id,
		readonly roomType: RoomType,
		readonly checkIn: Date,
		readonly checkOut: Date
	) {}

	static create(bookingProperties: {
		id: Id;
		employeeId: Id;
		hotelId: Id;
		roomType: RoomType;
		checkIn: Date;
		checkOut: Date;
	}) {
		return new Booking(
			bookingProperties.id,
			bookingProperties.employeeId,
			bookingProperties.hotelId,
			bookingProperties.roomType,
			bookingProperties.checkIn,
			bookingProperties.checkOut
		);
	}
}

describe('generates booking with id and information', () => {
	const hotelService = new HotelService(new HotelRepository());
	const policyService = new BookingPolicyService(new BookingPolicyRepository(), new CompanyRepository());
	const bookingRepository = new BookingRepository();
	const bookingService = new BookingService(bookingRepository, hotelService, policyService);

	it('generates booking for a given employee policy at a hotel with available standard rooms', () => {
		const employeeId = Id.generate();
		const hotelId = Id.generate();
		const roomType = RoomType.Standard;
		const checkIn = new Date('01-01-2022');
		const checkOut = new Date('03-01-2022');
		const hotel = Hotel.create(hotelId, 'my hotel');
		hotel.addOrUpdateRoom(Room.create(1, roomType, hotelId));
		const findHotelByStub = createFindHotelByStub(hotel, hotelService);
		const isBookingAllowedStub = createIsBookingAllowedStub(true, policyService);
		const bookingRepositorySpy = jest.spyOn(bookingRepository, 'createBooking');
		const actualBooking: Booking = bookingService.book(employeeId, hotelId, roomType, checkIn, checkOut);

		expect(actualBooking.employeeId).toBe(employeeId);
		expect(actualBooking.hotelId).toBe(hotelId);
		expect(actualBooking.roomType).toBe(roomType);
		expect(actualBooking.checkIn).toBe(checkIn);
		expect(actualBooking.checkOut).toBe(checkOut);
		expect(bookingRepositorySpy).toHaveBeenCalledWith(actualBooking);
		findHotelByStub.mockRestore();
		isBookingAllowedStub.mockRestore();
	});

	function createFindHotelByStub(hotel: Hotel, hotelService: HotelService) {
		const stub = jest.spyOn(hotelService, 'findHotelBy');
		stub.mockImplementation(() => Maybe.Just(hotel));
		return stub;
	}

	function createIsBookingAllowedStub(isAllowed: boolean, policyService: BookingPolicyService) {
		const stub = jest.spyOn(policyService, 'isBookingAllowed');
		stub.mockImplementation(() => isAllowed);
		return stub;
	}
});
