import { CompanyPolicy, Employee, EmployeePolicy, Id, RoomType } from '../models';
import { Maybe, Nothing } from 'monet';

export class BookingPolicyRepository {
	constructor(private employeePolicies: EmployeePolicy[] = [], private companyPolicies: CompanyPolicy[] = []) {}

	findEmployeePolicyBy(employeeId: Id): Maybe<EmployeePolicy> {
		const employeePolicy = this.employeePolicies.filter((policy) => policy.employeeId.isEquals(employeeId))[0];
		return Maybe.fromNull(employeePolicy);
	}

	findCompanyPolicyBy(companyId: Id): Maybe<CompanyPolicy> {
		const companyPolicy = this.companyPolicies.filter((policy) => policy.companyId.isEquals(companyId))[0];
		return Maybe.fromNull(companyPolicy);
	}

	createOrUpdateEmployeePolicy(employeeId: Id, roomTypes: RoomType[]) {
		const employeePolicy = new EmployeePolicy(employeeId, roomTypes);
		if (this.findEmployeePolicyBy(employeeId).isSome()) {
			this.deleteEmployeePolicy(employeeId);
		}
		this.employeePolicies.push(employeePolicy);
	}

	createOrUpdateCompanyPolicy(companyId: Id, roomTypes: RoomType[]) {
		const companyPolicy = new CompanyPolicy(companyId, roomTypes);
		if (this.findCompanyPolicyBy(companyId).isSome()) {
			this.deleteCompanyPolicy(companyId);
		}
		this.companyPolicies.push(companyPolicy);
	}

	deleteEmployeePolicy(employeeId: Id) {
		this.employeePolicies = this.employeePolicies.filter((policy) => !policy.employeeId.isEquals(employeeId));
	}

	deleteCompanyPolicy(companyId: Id) {
		this.companyPolicies = this.companyPolicies.filter((policy) => !policy.companyId.isEquals(companyId));
	}
}
