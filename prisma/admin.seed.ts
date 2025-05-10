import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

async function main() {
  const hashedPassword = await hashPassword("Ashibhatt123@");

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      firstName: "Ashish",
      lastName: "Bhatt",
      email: "ashishbhatt0197@gmail.com",
      password: hashedPassword,
      role: Role.ADMIN,
      phoneNumber: "7895633735",
      profilePic:
        "https://img.freepik.com/free-vector/smiling-redhaired-cartoon-boy_1308-174709.jpg?semt=ais_hybrid&w=740",
      walletAddress: "0xd1134dDcf76cff8E1D0475648B56CfAA521B5EFd",
      isProfileCompleted: true,
    },
  });

  console.log(`Created admin user with id: ${adminUser.id}`);

  const adminAddress = await prisma.address.create({
    data: {
      userId: adminUser.id,
      street: "Shivaji Nagar",
      city: "Rishikesh",
      state: "Uttarakhand",
      country: "India",
      zipCode: "249201",
    },
  });

  console.log(`Created address for admin user with id: ${adminAddress.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
