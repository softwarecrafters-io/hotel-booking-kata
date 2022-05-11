import { Employee, Id } from '../../core/models';
import { Maybe } from 'monet';
import { CompanyService } from '../../core/services/companyService';
import { CompanyRepository } from '../../core/repositories/companyRepository';
import { PolicyRepository } from '../../core/repositories/policyRepository';

describe('The company service', () => {
	const companyRepository = new CompanyRepository();
	const policyRepository = new PolicyRepository();
	const companyService = new CompanyService(companyRepository, policyRepository);

	it('allows to add a new employee', () => {
		const companyRepositorySpy = jest.spyOn(companyRepository, 'createEmployee');
		const companyId = Id.generate();
		const employeeId = Id.generate();

		companyService.addEmployee(companyId, employeeId);

		expect(companyRepositorySpy).toHaveBeenCalledWith(companyId, employeeId);
		companyRepositorySpy.mockRestore();
	});

	it('does not allow to add a duplicated employee', () => {
		const companyId = Id.generate();
		const employeeId = Id.generate();
		const companyRepositoryStub = jest.spyOn(companyRepository, 'findEmployeeById');
		companyRepositoryStub.mockImplementation(() => Maybe.fromNull(Employee.create(companyId, employeeId)));

		const command = () => companyService.addEmployee(companyId, employeeId);

		expect(command).toThrow(`Employee ${employeeId} already exists`);
	});

	it('allows to delete an employee and his policies for a given identifier', () => {
		const companyRepositorySpy = jest.spyOn(companyRepository, 'deleteEmployee');
		const policiesRepositorySpy = jest.spyOn(policyRepository, 'deleteEmployeePolicy');
		const employeeId = Id.generate();

		companyService.deleteEmployee(employeeId);

		expect(companyRepositorySpy).toHaveBeenCalledWith(employeeId);
		expect(policiesRepositorySpy).toHaveBeenCalledWith(employeeId);
		companyRepositorySpy.mockRestore();
		policiesRepositorySpy.mockRestore();
	});
});
