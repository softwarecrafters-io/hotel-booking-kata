import { Hotel, Id, Room, RoomType } from '../models';
import { Maybe, Nothing } from 'monet';

export class HotelRepository {
	constructor(private hotels: Hotel[] = []) {}

	createHotel(hotelId: Id, hotelName: string) {
		const hotel = Hotel.create(hotelId, hotelName);
		this.hotels.push(hotel);
	}

	findHotelById(hotelId: Id): Maybe<Hotel> {
		const filteredHotels = this.hotels.filter((hotel) => hotel.id.isEquals(hotelId));
		return Maybe.fromNull(filteredHotels[0]);
	}

	addOrUpdateHotelRoom(hotelId: Id, roomNumber: number, roomType: RoomType) {
		const room = Room.create(roomNumber, roomType, hotelId);
		this.hotels.forEach((hotel) => {
			if (hotel.id.isEquals(hotelId)) {
				hotel.addOrUpdateRoom(room);
			}
		});
	}
}
