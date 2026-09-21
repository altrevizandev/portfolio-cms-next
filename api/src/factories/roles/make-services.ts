import { RoleRepository } from "../../repositories/Role-repository.js";
import { ListRolesService } from "../../services/roles/List-service.js";

export function makeListRolesService() {
  return new ListRolesService(new RoleRepository());
}
