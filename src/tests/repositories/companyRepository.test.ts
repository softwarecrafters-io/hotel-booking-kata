import { CompanyRepository } from '../../core/repositories/companyRepository';
import { Employee, Id } from '../../core/models';

describe('The company repository', () => {
	it('finds an employee for a given employee id', () => {
		const companyId = Id.generate();
		const employeeId = Id.generate();
		const expectedEmployee = Employee.create(companyId, employeeId);
		const companyRepository = new CompanyRepository([expectedEmployee]);

		const actualEmployee = companyRepository.findEmployeeById(employeeId).some();

		expect(actualEmployee).toEqual(expectedEmployee);
	});

	it('adds employee for a given company id and employee id', () => {
		const companyId = Id.generate();
		const employeeId = Id.generate();
		const expectedEmployee = Employee.create(companyId, employeeId);
		const companyRepository = new CompanyRepository();

		companyRepository.createEmployee(companyId, employeeId);

		const actualEmployee = companyRepository.findEmployeeById(employeeId).some();
		expect(actualEmployee).toEqual(expectedEmployee);
	});

	it('adds employee for a given company id and employee id', () => {
		const companyId = Id.generate();
		const employeeId = Id.generate();
		const expectedEmployee = Employee.create(companyId, employeeId);
		const companyRepository = new CompanyRepository();

		companyRepository.createEmployee(companyId, employeeId);

		const actualEmployee = companyRepository.findEmployeeById(employeeId).some();
		expect(actualEmployee).toEqual(expectedEmployee);
	});
});
