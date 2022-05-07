import { HotelRepository } from '../../core/repositories/hotelRepository';
import { Hotel, Id, Room, RoomType } from '../../core/models';

describe('The hotel repository', () => {
	const hotelId = Id.generate();
	const hotelName = 'irrelevant-name';

	it('finds a hotel for a given identifier', () => {
		const expectedHotel = Hotel.create(hotelId, hotelName);
		const hotelRepository = new HotelRepository([expectedHotel]);

		const maybeHotel = hotelRepository.findHotelById(hotelId);

		expect(maybeHotel.some()).toEqual(expectedHotel);
	});

	it('creates a hotel for a given id and name', () => {
		const expectedHotel = Hotel.create(hotelId, hotelName);
		const hotelRepository = new HotelRepository([]);

		hotelRepository.createHotel(expectedHotel.id, expectedHotel.name);
		const maybeHotel = hotelRepository.findHotelById(hotelId);

		expect(maybeHotel.some()).toEqual(expectedHotel);
	});

	it('adds new room to an existing hotel', () => {
		const expectedRoom = Room.create(25, RoomType.Standard, hotelId);
		const hotelRepository = new HotelRepository([]);
		hotelRepository.createHotel(hotelId, hotelName);
		const hotel = hotelRepository.findHotelById(hotelId).some();

		hotelRepository.addOrUpdateHotelRoom(hotel.id, expectedRoom.roomNumber, expectedRoom.roomType);

		expect(hotel.getRooms().length).toEqual(1);
		expect(hotel.getRooms()).toContainEqual(expectedRoom);
	});

	it('updates an existing room for a given hotel', () => {
		const expectedRoom = Room.create(25, RoomType.Standard, hotelId);
		const hotelRepository = new HotelRepository([]);
		hotelRepository.createHotel(hotelId, hotelName);
		const hotel = hotelRepository.findHotelById(hotelId).some();

		hotelRepository.addOrUpdateHotelRoom(hotel.id, expectedRoom.roomNumber, RoomType.JuniorSuite);
		hotelRepository.addOrUpdateHotelRoom(hotel.id, expectedRoom.roomNumber, expectedRoom.roomType);

		expect(hotel.getRooms().length).toEqual(1);
		expect(hotel.getRooms()).toContainEqual(expectedRoom);
	});
});
