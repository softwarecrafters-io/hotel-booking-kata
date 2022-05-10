import { HotelService } from '../../core/services/hotelService';
import { BookingPolicyService } from '../../core/services/bookingPolicyService';
import { HotelRepository } from '../../core/repositories/hotelRepository';
import { BookingPolicyRepository } from '../../core/repositories/bookingPolicyRepository';
import { CompanyRepository } from '../../core/repositories/companyRepository';
import { Booking, Hotel, Id, Room, RoomType } from '../../core/models';
import { Maybe } from 'monet';
import { BookingService } from '../../core/services/bookingService';
import { BookingRepository } from '../../repositories/bookingRepository';

describe('generates booking with id and information', () => {
	const hotelService = new HotelService(new HotelRepository());
	const policyService = new BookingPolicyService(new BookingPolicyRepository(), new CompanyRepository());
	const bookingRepository = new BookingRepository();
	const bookingService = new BookingService(bookingRepository, hotelService, policyService);
	const employeeId = Id.generate();
	const hotelId = Id.generate();
	const roomType = RoomType.Standard;
	const checkIn = new Date('01-01-2022'); //mm/dd/yyyy
	const checkOut = new Date('01-03-2022'); //mm/dd/yyyy
	const hotel = Hotel.create(hotelId, 'my hotel');
	hotel.addOrUpdateRoom(Room.create(1, roomType, hotelId));

	it('generates booking for a given employee policy at a hotel with available standard rooms', () => {
		const findHotelByStub = createFindHotelByStub(Maybe.fromNull(hotel), hotelService);
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

	it('generates booking when there are available rooms left for a date', () => {
		const findHotelByStub = createFindHotelByStub(Maybe.fromNull(hotel), hotelService);
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

	it('does not allows booking when checkout is before check in', () => {
		const findHotelByStub = createFindHotelByStub(Maybe.fromNull(hotel), hotelService);

		const action = () => bookingService.book(employeeId, hotelId, roomType, checkOut, checkIn);

		expect(action).toThrow('Check-out has to be at least one day after check-in');
		findHotelByStub.mockRestore();
	});

	it('does not allows booking when checkout is in the same day as check in', () => {
		const findHotelByStub = createFindHotelByStub(Maybe.fromNull(hotel), hotelService);

		const action = () => bookingService.book(employeeId, hotelId, roomType, checkIn, checkIn);

		expect(action).toThrow('Check-out has to be at least one day after check-in');
		findHotelByStub.mockRestore();
	});

	it('does not allows booking when given hotel does not exists', () => {
		const findHotelByStub = createFindHotelByStub(Maybe.Nothing(), hotelService);

		const action = () => bookingService.book(employeeId, hotelId, roomType, checkIn, checkOut);

		expect(action).toThrow('Hotel is not found');
		findHotelByStub.mockRestore();
	});

	it('does not allows booking when the type of room is not provide by the given hotel', () => {
		const findHotelByStub = createFindHotelByStub(Maybe.Just(hotel), hotelService);

		const action = () => bookingService.book(employeeId, hotelId, RoomType.JuniorSuite, checkIn, checkOut);

		expect(action).toThrow('Hotel does not provide this type of room');
		findHotelByStub.mockRestore();
	});

	it('does not allows booking when the type of room is not provided by the given hotel', () => {
		const findHotelByStub = createFindHotelByStub(Maybe.Just(hotel), hotelService);

		const action = () => bookingService.book(employeeId, hotelId, RoomType.JuniorSuite, checkIn, checkOut);

		expect(action).toThrow('Hotel does not provide this type of room');
		findHotelByStub.mockRestore();
	});

	it('does not allows booking when the type of room is not provided by the given hotel', () => {
		const findHotelByStub = createFindHotelByStub(Maybe.Just(hotel), hotelService);

		const action = () => bookingService.book(employeeId, hotelId, RoomType.JuniorSuite, checkIn, checkOut);

		expect(action).toThrow('Hotel does not provide this type of room');
		findHotelByStub.mockRestore();
	});

	it('does not allows booking when is not allowed by policy', () => {
		const findHotelByStub = createFindHotelByStub(Maybe.Just(hotel), hotelService);
		const isBookingAllowedStub = createIsBookingAllowedStub(false, policyService);

		const action = () => bookingService.book(employeeId, hotelId, roomType, checkIn, checkOut);

		expect(action).toThrow('The policy does not allow booking');
		findHotelByStub.mockRestore();
		isBookingAllowedStub.mockRestore();
	});

	function createGetBookingsByStub(booking: Booking) {
		const getBookingsByStub = jest.spyOn(bookingRepository, 'getBookingsBy');
		getBookingsByStub.mockImplementation(() => [booking]);
		return getBookingsByStub;
	}

	it('does not allows booking when there no available rooms', () => {
		const findHotelByStub = createFindHotelByStub(Maybe.Just(hotel), hotelService);
		const booking = Booking.create({ id: Id.generate(), employeeId, hotelId, roomType, checkIn, checkOut });
		const getBookingsByStub = createGetBookingsByStub(booking);
		const action = () => bookingService.book(employeeId, hotelId, roomType, checkIn, checkOut);

		expect(action).toThrow('There are not available rooms');
		findHotelByStub.mockRestore();
		getBookingsByStub.mockRestore();
	});

	function createFindHotelByStub(hotel: Maybe<Hotel>, hotelService: HotelService) {
		const stub = jest.spyOn(hotelService, 'findHotelBy');
		stub.mockImplementation(() => hotel);
		return stub;
	}

	function createIsBookingAllowedStub(isAllowed: boolean, policyService: BookingPolicyService) {
		const stub = jest.spyOn(policyService, 'isBookingAllowed');
		stub.mockImplementation(() => isAllowed);
		return stub;
	}
});
