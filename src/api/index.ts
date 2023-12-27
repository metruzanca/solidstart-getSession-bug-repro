import { action, cache } from "@solidjs/router";
import { getUser as gU, logout as l, loginOrRegister as lOR,
  createProject as _createProject,
  listProjects as _listProjects,
} from "./server";

export const getUser = cache(gU, "user");
export const loginOrRegister = action(lOR, "loginOrRegister");
export const logout = action(l, "logout");

export const createProject = action(_createProject, "createProject");
export const listProjects = cache(_listProjects, "projects");
