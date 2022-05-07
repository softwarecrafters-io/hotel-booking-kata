import { BookingPolicyRepository } from '../../core/repositories/bookingPolicyRepository';
import { CompanyPolicy, EmployeePolicy, Id, RoomType } from '../../core/models';
import { Nothing } from 'monet';

describe('The booking policy repository', () => {
	it('Finds employee policy by identifier', () => {
		const policyId = Id.generate();
		const expectedPolicy = new EmployeePolicy(policyId, [RoomType.Standard]);
		const bookingPolicyRepository = new BookingPolicyRepository([expectedPolicy]);

		const actualPolicy = bookingPolicyRepository.findEmployeePolicyBy(policyId);

		expect(actualPolicy.just()).toEqual(expectedPolicy);
	});

	it('Finds nothing when employee policy does not exists', () => {
		const policyId = Id.generate();
		const bookingPolicyRepository = new BookingPolicyRepository();

		const actualPolicy = bookingPolicyRepository.findEmployeePolicyBy(policyId);

		expect(actualPolicy).toEqual(Nothing());
	});

	it('Finds company policy by identifier', () => {
		const companyId = Id.generate();
		const companyPolicy = new CompanyPolicy(companyId, [RoomType.Standard]);
		const bookingPolicyRepository = new BookingPolicyRepository([], [companyPolicy]);

		const actualPolicy = bookingPolicyRepository.findCompanyPolicyBy(companyId);

		expect(actualPolicy.just()).toEqual(companyPolicy);
	});

	it('Finds nothing when company policy does not exists', () => {
		const policyId = Id.generate();
		const bookingPolicyRepository = new BookingPolicyRepository();

		const actualPolicy = bookingPolicyRepository.findCompanyPolicyBy(policyId);

		expect(actualPolicy).toEqual(Nothing());
	});

	it('Creates a new employee policy', () => {
		const policyId = Id.generate();
		const allowedRoomTypes = [RoomType.Standard];
		const expectedPolicy = new EmployeePolicy(policyId, allowedRoomTypes);
		const bookingPolicyRepository = new BookingPolicyRepository();

		bookingPolicyRepository.createOrUpdateEmployeePolicy(policyId, allowedRoomTypes);
		const actualPolicy = bookingPolicyRepository.findEmployeePolicyBy(policyId);

		expect(actualPolicy.just()).toEqual(expectedPolicy);
	});

	it('Creates a new company policy', () => {
		const companyId = Id.generate();
		const allowedRoomTypes = [RoomType.Standard];
		const expectedPolicy = new CompanyPolicy(companyId, allowedRoomTypes);
		const bookingPolicyRepository = new BookingPolicyRepository();

		bookingPolicyRepository.createOrUpdateCompanyPolicy(companyId, allowedRoomTypes);
		const actualPolicy = bookingPolicyRepository.findCompanyPolicyBy(companyId);

		expect(actualPolicy.just()).toEqual(expectedPolicy);
	});

	it('Updates an existing employee policy', () => {
		const policyId = Id.generate();
		const allowedRoomTypes = [RoomType.Standard];
		const previousPolicy = new EmployeePolicy(policyId, allowedRoomTypes);
		const expectedPolicy = new EmployeePolicy(policyId, [RoomType.Standard, RoomType.JuniorSuite]);
		const bookingPolicyRepository = new BookingPolicyRepository([previousPolicy]);

		bookingPolicyRepository.createOrUpdateEmployeePolicy(
			expectedPolicy.employeeId,
			expectedPolicy.getAllowedRoomTypes()
		);
		const actualPolicy = bookingPolicyRepository.findEmployeePolicyBy(policyId);

		expect(actualPolicy.just()).toEqual(expectedPolicy);
	});

	it('Updates an existing company policy', () => {
		const policyId = Id.generate();
		const allowedRoomTypes = [RoomType.Standard];
		const previousPolicy = new CompanyPolicy(policyId, allowedRoomTypes);
		const expectedPolicy = new CompanyPolicy(policyId, [RoomType.Standard, RoomType.JuniorSuite]);
		const bookingPolicyRepository = new BookingPolicyRepository([], [previousPolicy]);

		bookingPolicyRepository.createOrUpdateCompanyPolicy(expectedPolicy.companyId, expectedPolicy.getAllowedRoomTypes());
		const actualPolicy = bookingPolicyRepository.findCompanyPolicyBy(policyId);

		expect(actualPolicy.just()).toEqual(expectedPolicy);
	});

	it('Removes an existing employee policy', () => {
		const policyId = Id.generate();
		const allowedRoomTypes = [RoomType.Standard];
		const previousPolicy = new EmployeePolicy(policyId, allowedRoomTypes);
		const bookingPolicyRepository = new BookingPolicyRepository([previousPolicy]);

		bookingPolicyRepository.deleteEmployeePolicy(policyId);
		const actualPolicy = bookingPolicyRepository.findEmployeePolicyBy(policyId);

		expect(actualPolicy).toEqual(Nothing());
	});

	it('Removes an existing company policy', () => {
		const policyId = Id.generate();
		const allowedRoomTypes = [RoomType.Standard];
		const previousPolicy = new CompanyPolicy(policyId, allowedRoomTypes);
		const bookingPolicyRepository = new BookingPolicyRepository([], [previousPolicy]);

		bookingPolicyRepository.deleteCompanyPolicy(policyId);
		const actualPolicy = bookingPolicyRepository.findCompanyPolicyBy(policyId);

		expect(actualPolicy).toEqual(Nothing());
	});
});
