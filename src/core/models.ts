import { v4 as uuid } from 'uuid';

export class Id {
	private constructor(readonly value: string) {}

	static generate() {
		return new Id(uuid());
	}

	isEquals(id: Id) {
		return this.value === id.value;
	}
}

export class Hotel {
	private rooms: Room[] = [];
	private constructor(readonly id: Id, readonly name: string) {}

	static create(id: Id, name: string) {
		return new Hotel(id, name);
	}

	hasRoomType(roomType: RoomType) {
		return this.rooms.map((r) => r.roomType).includes(roomType);
	}

	getRooms() {
		return this.rooms;
	}

	getRoomsByType(type: RoomType) {
		return this.getRooms().filter((r) => r.roomType === type);
	}

	addOrUpdateRoom(room: Room) {
		this.deleteRoom(room);
		this.addRoom(room);
	}

	private addRoom(room: Room) {
		this.rooms.push(room);
	}

	private deleteRoom(room: Room) {
		this.rooms = this.rooms.filter((r) => r.roomNumber !== room.roomNumber);
	}
}

export enum RoomType {
	Standard = 'standard',
	JuniorSuite = 'juniorSuite',
	MasterSuite = 'masterSuite',
}

export class Room {
	private constructor(readonly roomNumber: number, readonly roomType: RoomType, readonly hotelId: Id) {}

	static create(roomNumber: number, roomType: RoomType, hotelId: Id) {
		return new Room(roomNumber, roomType, hotelId);
	}
}

export class Employee {
	private constructor(readonly companyId: Id, readonly id: Id) {}

	static create(companyId: Id, id: Id) {
		return new Employee(companyId, id);
	}
}

export class EmployeePolicy {
	constructor(readonly employeeId: Id, private allowedRoomTypes: RoomType[]) {}

	getAllowedRoomTypes() {
		return this.allowedRoomTypes;
	}
}

export class CompanyPolicy {
	constructor(readonly companyId: Id, private allowedRoomTypes: RoomType[]) {}

	getAllowedRoomTypes() {
		return this.allowedRoomTypes;
	}
}

export class Booking {
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
		this.checkIfAtLeastOneDayBetweenDates(bookingProperties.checkIn, bookingProperties.checkOut);
		return new Booking(
			bookingProperties.id,
			bookingProperties.employeeId,
			bookingProperties.hotelId,
			bookingProperties.roomType,
			bookingProperties.checkIn,
			bookingProperties.checkOut
		);
	}

	static checkIfAtLeastOneDayBetweenDates(checkIn: Date, checkOut: Date) {
		const difference = checkOut.getTime() - checkIn.getTime();
		const millisecondsPerDay = 1000 * 3600 * 24;
		const differenceInDays = Math.ceil(difference / millisecondsPerDay);
		const areNotValidDates = checkOut < checkIn || differenceInDays < 1;
		if (areNotValidDates) {
			throw new Error('Check-out has to be at least one day after check-in');
		}
	}
}
