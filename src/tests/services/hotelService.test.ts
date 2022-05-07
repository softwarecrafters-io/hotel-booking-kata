import { Maybe } from 'monet';
import { Hotel, Id, RoomType } from '../../core/models';
import { HotelRepository } from '../../core/repositories/hotelRepository';
import { HotelService } from '../../core/services/hotelService';

describe('The services service', () => {
	const hotelRepository = new HotelRepository([]);
	const hotelService = new HotelService(hotelRepository);
	const hotelName = 'irrelevant-name';

	it('adds a new hotel into repository for a given id and name', () => {
		const hotelRepositorySpy = jest.spyOn(hotelRepository, 'createHotel');
		const hotelId = Id.generate();

		hotelService.addHotel(hotelId, hotelName);

		expect(hotelRepositorySpy).toHaveBeenCalledWith(hotelId, hotelName);
		hotelRepositorySpy.mockRestore();
	});

	it('finds an existing hotel by identifier', () => {
		const hotelId = Id.generate();
		const hotelRepositoryStub = createStubWithExistingHotel(hotelId);

		const result = hotelService.findHotelBy(hotelId);

		expect(result.isJust()).toBe(true);
		hotelRepositoryStub.mockRestore();
	});

	it('does not allow adding an existing hotel', () => {
		const hotelId = Id.generate();
		const hotelRepositoryStub = createStubWithExistingHotel(hotelId);

		const command = () => hotelService.addHotel(hotelId, hotelName);

		expect(command).toThrow(`Hotel ${hotelId.value} already exists`);
		hotelRepositoryStub.mockRestore();
	});

	it('adds or updates a room for a given existing hotel', () => {
		const hotelId = Id.generate();
		const hotelRepositoryStub = createStubWithExistingHotel(hotelId);
		const hotelRepositorySpy = jest.spyOn(hotelRepository, 'addOrUpdateHotelRoom');
		const roomNumber = 25;
		const roomType = RoomType.Standard;

		hotelService.setRoom(hotelId, roomNumber, roomType);

		expect(hotelRepositorySpy).toHaveBeenCalledWith(hotelId, roomNumber, roomType);
		hotelRepositorySpy.mockRestore();
		hotelRepositoryStub.mockRestore();
	});

	it('does not allow adding or updating room for a given unknown hotel', () => {
		const hotelId = Id.generate();

		const command = () => hotelService.setRoom(hotelId, 25, RoomType.Standard);

		expect(command).toThrow(`Hotel ${hotelId.value} does not found`);
	});

	function createStubWithExistingHotel(id: Id) {
		const hotelRepositoryStub = jest.spyOn(hotelRepository, 'findHotelById');
		hotelRepositoryStub.mockImplementation(() => Maybe.Just(Hotel.create(id, hotelName)));
		return hotelRepositoryStub;
	}
});
