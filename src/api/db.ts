import { createStorage } from "unstorage";
import fsLiteDriver from "unstorage/drivers/fs-lite";

type User = {
  id: number;
  username: string;
  password: string;
};

type Project = {
  id: number;
  owner_id: string;
  name: string;
}

const storage = createStorage({
  driver: fsLiteDriver({
    base: "./.data",
  }),
});
storage.setItem("users:data", [
  { id: 0, username: "kody", password: "twixrox" },
]);
storage.setItem("users:counter", 1);

export const db = {
  user: {
    async create({ data }: { data: { username: string; password: string } }) {
      const [{ value: users }, { value: index }] = await storage.getItems([
        "users:data",
        "users:counter",
      ]);
      const user = { ...data, id: index as number };
      await Promise.all([
        storage.setItem("users:data", [...(users as User[]), user]),
        storage.setItem("users:counter", (index as number) + 1),
      ]);
      return user;
    },
    async findUnique({
      where: { username = undefined, id = undefined },
    }: {
      where: { username?: string; id?: number };
    }) {
      const users = (await storage.getItem("users:data")) as User[];
      if (id !== undefined) {
        return users.find((user) => user.id === id);
      } else {
        return users.find((user) => user.username === username);
      }
    },
  },
  project: {
    async create(user_id: string) {
      const [{ value: projects }, { value: index }] = await storage.getItems([
        "projects:data",
        "projects:counter",
      ]);

      const project: Project = {
        name: 'Project ' + Math.random(),
        owner_id: user_id,
        id: index as number
      };
      await Promise.all([
        storage.setItem("projects:data", [...(projects as Project[] ?? []), project]),
        storage.setItem("projects:counter", (index as number ?? 0) + 1),
      ]);
      return project;
    },
    async list(user_id: string) {
      const projects = await storage.getItem("projects:data")
      if (projects)    
        return (projects as Project[]).filter(project => project.owner_id === user_id)
      return []
    }
  }
};
