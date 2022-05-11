import { Id } from '../models';
import { CompanyRepository } from '../repositories/companyRepository';
import { PolicyRepository } from '../repositories/policyRepository';

export class CompanyService {
	constructor(private companyRepository: CompanyRepository, private policyRepository: PolicyRepository) {}

	addEmployee(companyId: Id, employeeId: Id) {
		if (this.employeeExists(employeeId)) {
			throw new Error(`Employee ${employeeId} already exists`);
		}
		this.companyRepository.createEmployee(companyId, employeeId);
	}

	private employeeExists(employeeId: Id) {
		return this.companyRepository.findEmployeeById(employeeId).isJust();
	}

	deleteEmployee(employeeId: Id) {
		this.companyRepository.deleteEmployee(employeeId);
		this.policyRepository.deleteEmployeePolicy(employeeId);
	}
}
