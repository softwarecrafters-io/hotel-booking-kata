import { Employee, Id } from '../models';
import { Maybe } from 'monet';

export class CompanyRepository {
	constructor(private employees: Employee[] = []) {}

	createEmployee(companyId: Id, employeeId: Id) {
		const employee = Employee.create(companyId, employeeId);
		this.employees.push(employee);
	}

	findEmployeeById(employeeId: Id): Maybe<Employee> {
		const filteredEmployees = this.employees.filter((employee) => employee.id.isEquals(employeeId));
		return Maybe.fromNull(filteredEmployees[0]);
	}

	deleteEmployee(employeeId: Id) {}
}
