import { CompanyPolicy, Employee, EmployeePolicy, Id, RoomType } from '../../core/models';
import { PolicyRepository } from '../../core/repositories/policyRepository';
import { Maybe } from 'monet';
import { CompanyRepository } from '../../core/repositories/companyRepository';
import { BookingPolicyService } from '../../core/services/bookingPolicyService';

describe('The Booking Policy Service', () => {
	const bookingPolicyRepository = new PolicyRepository();
	const companyRepository = new CompanyRepository();
	const bookingPolicyService = new BookingPolicyService(bookingPolicyRepository, companyRepository);

	it('sets a company policy for a given company id and room types', () => {
		const companyId = Id.generate();
		const roomTypes = [RoomType.Standard];
		const bookingPolicyRepositorySpy = jest.spyOn(bookingPolicyRepository, 'createOrUpdateCompanyPolicy');

		bookingPolicyService.setCompanyPolicy(companyId, roomTypes);

		expect(bookingPolicyRepositorySpy).toHaveBeenCalledWith(companyId, roomTypes);
	});

	it('sets a employee policy for a given company id and room types', () => {
		const employeeId = Id.generate();
		const roomTypes = [RoomType.Standard];
		const bookingPolicyRepositorySpy = jest.spyOn(bookingPolicyRepository, 'createOrUpdateEmployeePolicy');

		bookingPolicyService.setEmployeePolicy(employeeId, roomTypes);

		expect(bookingPolicyRepositorySpy).toHaveBeenCalledWith(employeeId, roomTypes);
	});

	it('allows booking when there are not policies', () => {
		const policyRepositoryStub = createEmployeePolicyRepositoryStubBy();

		const isBookingAllowed = bookingPolicyService.isBookingAllowed(Id.generate(), RoomType.Standard);

		expect(isBookingAllowed).toBe(true);
		policyRepositoryStub.mockRestore();
	});

	it('does not allow booking when a employee policy is not respected', () => {
		const employeeId = Id.generate();
		const policy = new EmployeePolicy(employeeId, [RoomType.Standard, RoomType.JuniorSuite]);
		const policyRepositoryStub = createEmployeePolicyRepositoryStubBy(policy);

		const isBookingAllowed = bookingPolicyService.isBookingAllowed(employeeId, RoomType.MasterSuite);

		expect(isBookingAllowed).toBe(false);
		policyRepositoryStub.mockRestore();
	});

	it('allows booking when a employee policy matches', () => {
		const employeeId = Id.generate();
		const policy = new EmployeePolicy(employeeId, [RoomType.Standard, RoomType.JuniorSuite]);
		const policyRepositoryStub = createEmployeePolicyRepositoryStubBy(policy);

		const isBookingAllowed = bookingPolicyService.isBookingAllowed(employeeId, RoomType.Standard);

		expect(isBookingAllowed).toBe(true);
		policyRepositoryStub.mockRestore();
	});

	it('does not allow booking when a company policy is not respected', () => {
		const employeeId = Id.generate();
		const companyId = Id.generate();
		const policy = new CompanyPolicy(companyId, [RoomType.Standard, RoomType.JuniorSuite]);
		const policyRepositoryStub = createCompanyPolicyRepositoryStub(policy);
		const companyRepositoryStub = createCompanyRepositoryStub(companyId, employeeId);

		const isBookingAllowed = bookingPolicyService.isBookingAllowed(employeeId, RoomType.MasterSuite);

		expect(isBookingAllowed).toBe(false);
		policyRepositoryStub.mockRestore();
		companyRepositoryStub.mockRestore();
	});

	it('allows booking when a company policy matches', () => {
		const employeeId = Id.generate();
		const companyId = Id.generate();
		const policy = new CompanyPolicy(companyId, [RoomType.Standard, RoomType.JuniorSuite]);
		const policyRepositoryStub = createCompanyPolicyRepositoryStub(policy);
		const companyRepositoryStub = createCompanyRepositoryStub(companyId, employeeId);

		const isBookingAllowed = bookingPolicyService.isBookingAllowed(employeeId, RoomType.Standard);

		expect(isBookingAllowed).toBe(true);
		policyRepositoryStub.mockRestore();
		companyRepositoryStub.mockRestore();
	});

	it('allows booking by ensuring that employee policy take precedence', () => {
		const companyId = Id.generate();
		const companyPolicy = new CompanyPolicy(companyId, [RoomType.Standard]);
		const companyPolicyRepositoryStub = createCompanyPolicyRepositoryStub(companyPolicy);

		const isBookingAllowed = bookingPolicyService.isBookingAllowed(companyId, RoomType.JuniorSuite);

		expect(isBookingAllowed).toBe(true);
		companyPolicyRepositoryStub.mockRestore();
	});

	function createCompanyRepositoryStub(companyId: Id, employeeId: Id) {
		const companyRepositoryStub = jest.spyOn(companyRepository, 'findEmployeeById');
		companyRepositoryStub.mockImplementation(() => Maybe.fromNull(Employee.create(companyId, employeeId)));
		return companyRepositoryStub;
	}

	function createEmployeePolicyRepositoryStubBy(policy?: EmployeePolicy) {
		const policyRepositoryStub = jest.spyOn(bookingPolicyRepository, 'findEmployeePolicyBy');
		policyRepositoryStub.mockImplementation(() => Maybe.fromNull(policy));
		return policyRepositoryStub;
	}

	function createCompanyPolicyRepositoryStub(policy: CompanyPolicy) {
		const policyRepositoryStub = jest.spyOn(bookingPolicyRepository, 'findCompanyPolicyBy');
		policyRepositoryStub.mockImplementation(() => Maybe.fromNull(policy));
		return policyRepositoryStub;
	}
});
