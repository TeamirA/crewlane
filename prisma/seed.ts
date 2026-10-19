import { PrismaClient, ProjectRole, TaskPriority } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "Crewlane#2026";

const demoUsers = [
  { email: "amara@crewlane.dev", username: "amara", displayName: "Amara Bekele" },
  { email: "dawit@crewlane.dev", username: "dawit", displayName: "Dawit Haile" },
  { email: "lena@crewlane.dev", username: "lena", displayName: "Lena Okafor" },
];

const demoLabels = [
  { name: "Frontend", color: "#6366f1" },
  { name: "Backend", color: "#0ea5e9" },
  { name: "Design", color: "#ec4899" },
  { name: "Bug", color: "#ef4444" },
];

const demoTasks = [
  { column: 0, title: "Write launch announcement", priority: TaskPriority.MEDIUM, label: 2 },
  { column: 0, title: "Set up error monitoring", priority: TaskPriority.HIGH, label: 1 },
  { column: 0, title: "Audit color contrast", priority: TaskPriority.LOW, label: 2 },
  { column: 1, title: "Build pricing page", priority: TaskPriority.HIGH, label: 0 },
  { column: 1, title: "Fix signup redirect loop", priority: TaskPriority.HIGH, label: 3 },
  { column: 2, title: "Choose hosting provider", priority: TaskPriority.MEDIUM, label: 1 },
];

async function seedUsers() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  return Promise.all(
    demoUsers.map((user) =>
      prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: { ...user, passwordHash },
      }),
    ),
  );
}

async function seedProject(userIds: string[]) {
  const [ownerId, adminId, memberId] = userIds;
  return prisma.project.create({
    data: {
      name: "Website Launch",
      description: "Everything we need to ship the new marketing site.",
      members: {
        create: [
          { userId: ownerId, role: ProjectRole.OWNER },
          { userId: adminId, role: ProjectRole.ADMIN },
          { userId: memberId, role: ProjectRole.MEMBER },
        ],
      },
      columns: {
        create: ["To Do", "In Progress", "Done"].map((name, index) => ({
          name,
          position: (index + 1) * 1000,
        })),
      },
      labels: { create: demoLabels },
    },
    include: { columns: { orderBy: { position: "asc" } }, labels: true },
  });
}

async function seedTasks(project: Awaited<ReturnType<typeof seedProject>>, userIds: string[]) {
  for (const [index, task] of demoTasks.entries()) {
    const column = project.columns[task.column];
    await prisma.task.create({
      data: {
        projectId: project.id,
        columnId: column.id,
        title: task.title,
        priority: task.priority,
        position: (index + 1) * 1000,
        createdById: userIds[0],
        assignees: { create: [{ userId: userIds[index % userIds.length] }] },
        labels: { create: [{ labelId: project.labels[task.label].id }] },
      },
    });
  }
}

async function main() {
  const users = await seedUsers();
  const userIds = users.map((user) => user.id);
  const existingProject = await prisma.project.findFirst({ where: { name: "Website Launch" } });
  if (existingProject) {
    console.log("Seed data already present, skipping project creation.");
    return;
  }
  const project = await seedProject(userIds);
  await seedTasks(project, userIds);
  console.log(`Seeded ${users.length} users and project "${project.name}".`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
