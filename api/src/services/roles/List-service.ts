import type { RoleContract } from "../../contracts/RoleContract.js";

export class ListRolesService {
  constructor(private readonly rolesRepository: RoleContract) {}

  public async execute() {
    const roles = await this.rolesRepository.list();

    return roles;
  }
}
