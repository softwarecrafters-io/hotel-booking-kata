import { Hotel, Id } from '../core/models';
import { Maybe } from 'monet';
import { HotelRepository } from '../core/repositories/hotelRepository';

export function createStubWithExistingHotel(hotel: Hotel, hotelRepository: HotelRepository) {
	const hotelRepositoryStub = jest.spyOn(hotelRepository, 'findHotelById');
	hotelRepositoryStub.mockImplementation(() => Maybe.Just(hotel));
	return hotelRepositoryStub;
}
