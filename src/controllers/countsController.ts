import prisma from "../config/db.config";

export const getDashboardCounts = async (req: any, res: any) => {
  try {
    const usersCount = await prisma.user.count();
    const suppliersCount = await prisma.vendorOrganization.count();
    const pharmaciesCount = await prisma.pharmacyOutlet.count();
    const ordersCount = await prisma.order.count();
    const counts = {
      usersCount: usersCount,
      suppliersCount: suppliersCount,
      pharmaciesCount: pharmaciesCount,
      ordersCount: ordersCount,
    };

    return res.status(200).json({ data: counts });
  } catch (error) {
    console.error("Error fetching counts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
