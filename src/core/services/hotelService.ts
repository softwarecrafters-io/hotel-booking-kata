import { HotelRepository } from '../repositories/hotelRepository';
import { Id, RoomType } from '../models';

export class HotelService {
	constructor(private hotelRepository: HotelRepository) {}

	addHotel(hotelId: Id, hotelName: string) {
		if (this.hotelExists(hotelId)) {
			throw new Error(`Hotel ${hotelId.value} already exists`);
		}
		this.hotelRepository.createHotel(hotelId, hotelName);
	}

	findHotelBy(hotelId: Id) {
		return this.hotelRepository.findHotelById(hotelId);
	}

	setRoom(hotelId: Id, roomNumber: number, roomType: RoomType) {
		if (!this.hotelExists(hotelId)) {
			throw new Error(`Hotel ${hotelId.value} does not found`);
		}
		return this.hotelRepository.addOrUpdateHotelRoom(hotelId, roomNumber, roomType);
	}

	private hotelExists(hotelId: Id) {
		return this.hotelRepository.findHotelById(hotelId).isJust();
	}
}
