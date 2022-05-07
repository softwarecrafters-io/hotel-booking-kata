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

	getRooms() {
		return this.rooms;
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
