import { Booking, Id, RoomType } from '../../core/models';
import { BookingRepository } from '../../core/repositories/bookingRepository';

describe('The booking repository', () => {
	const id = Id.generate();
	const hotelId = Id.generate();
	const employeeId = Id.generate();

	it('gets booking by a given period and room type', () => {
		const roomType = RoomType.Standard;
		const checkIn = new Date('01/01/2022');
		const checkOut = new Date('01/03/2022');
		const expectedBookings = [Booking.create({ id, hotelId, employeeId, roomType, checkIn, checkOut })];
		const bookingRepository = new BookingRepository(expectedBookings);

		const actualBookings = bookingRepository.getBookingsBy(roomType, checkIn, checkOut);

		expect(actualBookings).toEqual(expectedBookings);
	});

	it('does not get booking when the room type does not match', () => {
		const roomType = RoomType.Standard;
		const checkIn = new Date('01/01/2022');
		const checkOut = new Date('01/03/2022');
		const expectedBookings = [Booking.create({ id, hotelId, employeeId, roomType, checkIn, checkOut })];
		const bookingRepository = new BookingRepository(expectedBookings);

		const actualBookings = bookingRepository.getBookingsBy(RoomType.JuniorSuite, checkIn, checkOut);

		expect(actualBookings).toEqual([]);
	});

	it('does not get booking when is out of the period', () => {
		const roomType = RoomType.Standard;
		const checkIn = new Date('01/02/2022');
		const checkOut = new Date('01/03/2022');
		const expectedBookings = [Booking.create({ id, hotelId, employeeId, roomType, checkIn, checkOut })];
		const bookingRepository = new BookingRepository(expectedBookings);

		const actualBookings = bookingRepository.getBookingsBy(
			RoomType.Standard,
			new Date('02/01/2022'),
			new Date('02/03/2022')
		);

		expect(actualBookings).toEqual([]);
	});

	it('get booking when booking checkin is between the given period', () => {
		const roomType = RoomType.Standard;
		const checkIn = new Date('01/02/2022');
		const checkOut = new Date('01/03/2022');
		const expectedBookings = [Booking.create({ id, hotelId, employeeId, roomType, checkIn, checkOut })];
		const bookingRepository = new BookingRepository(expectedBookings);

		const actualBookings = bookingRepository.getBookingsBy(
			RoomType.Standard,
			new Date('01/01/2022'),
			new Date('01/04/2022')
		);

		expect(actualBookings).toEqual(expectedBookings);
	});

	it('get booking when booking checkin is between the given period', () => {
		const roomType = RoomType.Standard;
		const checkIn = new Date('01/01/2022');
		const checkOut = new Date('01/02/2022');
		const expectedBookings = [Booking.create({ id, hotelId, employeeId, roomType, checkIn, checkOut })];
		const bookingRepository = new BookingRepository(expectedBookings);

		const actualBookings = bookingRepository.getBookingsBy(
			RoomType.Standard,
			new Date('01/02/2022'),
			new Date('01/03/2022')
		);

		expect(actualBookings).toEqual(expectedBookings);
	});

	it('creates a new booking', () => {
		const roomType = RoomType.Standard;
		const checkIn = new Date('01/01/2022');
		const checkOut = new Date('01/03/2022');
		const expectedBooking = Booking.create({ id, hotelId, employeeId, roomType, checkIn, checkOut });
		const bookingRepository = new BookingRepository();

		bookingRepository.createBooking(expectedBooking);
		const actualBooking = bookingRepository.getBookingsBy(roomType, checkIn, checkOut);
		expect(actualBooking).toEqual([expectedBooking]);
	});
});
