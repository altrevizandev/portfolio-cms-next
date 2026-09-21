import { StackRepository } from "../../repositories/Stack-repository.js";
import { StackCreateService } from "../../services/stack/Create-service.js";
import { StackDeleteService } from "../../services/stack/Delete-service.js";
import { StackDetailsService } from "../../services/stack/Details-service.js";
import { StackListService } from "../../services/stack/List-service.js";
import { StackUpdateService } from "../../services/stack/Update-service.js";

export function makeStackCreateService() {
  return new StackCreateService(new StackRepository());
}

export function makeStackDeleteService() {
  return new StackDeleteService(new StackRepository());
}

export function makeStackDetailsService() {
  return new StackDetailsService(new StackRepository());
}

export function makeStackListService() {
  return new StackListService(new StackRepository());
}

export function makeStackUpdateService() {
  return new StackUpdateService(new StackRepository());
}
