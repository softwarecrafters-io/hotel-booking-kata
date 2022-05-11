import { PolicyRepository } from '../repositories/policyRepository';
import { CompanyRepository } from '../repositories/companyRepository';
import { Id, RoomType } from '../models';

export class BookingPolicyService {
	constructor(private bookingPolicyRepository: PolicyRepository, private companyRepository: CompanyRepository) {}

	setCompanyPolicy(companyId: Id, roomTypes: RoomType[]) {
		this.bookingPolicyRepository.createOrUpdateCompanyPolicy(companyId, roomTypes);
	}

	setEmployeePolicy(employeeId: Id, roomTypes: RoomType[]) {
		this.bookingPolicyRepository.createOrUpdateEmployeePolicy(employeeId, roomTypes);
	}

	isBookingAllowed(employeeId: Id, roomType: RoomType) {
		const maybeEmployeePolicy = this.bookingPolicyRepository.findEmployeePolicyBy(employeeId);
		const maybeCompanyPolicy = this.companyRepository
			.findEmployeeById(employeeId)
			.flatMap((employee) => this.bookingPolicyRepository.findCompanyPolicyBy(employee.companyId));
		const allowedByDefault = true;

		return maybeEmployeePolicy
			.map((policy) => policy.getAllowedRoomTypes().includes(roomType))
			.catchMap(() => maybeCompanyPolicy.map((policy) => policy.getAllowedRoomTypes().includes(roomType)))
			.fold(allowedByDefault)((isAllowed) => isAllowed);
	}
}
