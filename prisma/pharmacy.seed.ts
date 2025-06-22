import {
  PrismaClient,
  Role,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

async function main() {
  // 1. Create Pharmacy User
  const pharmacyPassword = await hashPassword("Ashibhatt123@");
  const pharmacyUser = await prisma.user.create({
    data: {
      firstName: "Sachin",
      lastName: "Gusain",
      email: "Sachin@gmail.com",
      password: pharmacyPassword,
      role: Role.PHARMACY,
      phoneNumber: "9557002280",
      walletAddress: "0x3acf775a952ff9BB874B834AFA550A6FE8E2edaC",
      isProfileCompleted: true,
    },
  });

  console.log(`Created pharmacy user with id: ${pharmacyUser.id}`);

  // Create Address for Pharmacy User
  await prisma.address.create({
    data: {
      userId: pharmacyUser.id,
      street: "Atturuwala",
      city: "Jolly Grant",
      state: "Uttarakhand",
      country: "India",
      zipCode: "249204",
    },
  });

  // Create Pharmacy Outlet
  const pharmacyOutlet = await prisma.pharmacyOutlet.create({
    data: {
      ownerId: pharmacyUser.id,
      businessName: "MedLife Pharmacy",
      street: "789 Healthcare Ave",
      city: "Atturuwala",
      state: "Uttarakhand",
      pincode: "249204",
      phoneNumber: "9557002280",
      gstin: "GSTIN123456",
      email: "medlife@gmail.com",
      website: "https://medlifepharmacy.com",
    },
  });
  console.log(`Created pharmacy outlet with id: ${pharmacyOutlet.id}`);

  // 2. Create Supplier User
  const supplierPassword = await hashPassword("Ashibhatt123@");
  const supplierUser = await prisma.user.create({
    data: {
      firstName: "Ayush",
      lastName: "Panwar",
      email: "ayush@gmail.com",
      password: supplierPassword,
      role: Role.SUPPLIER,
      phoneNumber: "8599663355",
      walletAddress: "0xf6Bb0374A4ebBB05205E495522a5c245Ee7A9627",
      isProfileCompleted: true,
    },
  });
  console.log(`Created supplier user with id: ${supplierUser.id}`);

  // Create Address for Supplier User
  await prisma.address.create({
    data: {
      userId: supplierUser.id,
      street: "321 Durga Chowk",
      city: "Doiwala",
      state: "Uttarakhand",
      country: "India",
      zipCode: "249205",
    },
  });

  // Create Vendor Organization
  const vendorOrg = await prisma.vendorOrganization.create({
    data: {
      ownerId: supplierUser.id,
      businessName: "Prime Medical Supplies",
      gstin: "GSTINVENDOR12345",
      email: "prime@gmail.com",
      street: "123 Supply Street",
      city: "Doiwala",
      state: "Uttarakhand",
      pincode: "249205",
      phoneNumber: "8599663355",
      website: "https://primemedical.com",
    },
  });
  console.log(`Created vendor organization with id: ${vendorOrg.id}`);

  // 3. Create Sample Products
  const products = [
    {
      name: "Dolo 500mg",
      description: "Pain reliever and fever reducer",
      brand: "Generic",
      category: "Pain Relief",
      image: "https://example.com/paracetamol.jpg",
      unit: "tablet",

      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },
    {
      name: "Crocin Advance",
      description: "Effective relief from fever and pain",
      brand: "GSK",
      category: "Pain Relief",
      image: "https://example.com/crocin.jpg",
      unit: "tablet",

      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },
    {
      name: "Calpol 650mg",
      description: "Relieves fever and body ache",
      brand: "GlaxoSmithKline",
      category: "Pain Relief",
      image: "https://example.com/calpol.jpg",
      unit: "tablet",

      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },
    {
      name: "Nise Tablet",
      description: "Anti-inflammatory and pain reliever",
      brand: "Dr. Reddy's",
      category: "Pain Relief",
      image: "https://example.com/nise.jpg",
      unit: "tablet",

      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },
    {
      name: "Disprin",
      description: "Headache and cold relief",
      brand: "Bayer",
      category: "Pain Relief",
      image: "https://example.com/disprin.jpg",
      unit: "tablet",

      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },
    {
      name: "Ibuprofen 400mg",
      description:
        "Nonsteroidal anti-inflammatory drug for pain and inflammation",
      brand: "Advil",
      category: "Pain Relief",
      image: "https://example.com/ibuprofen.jpg",
      unit: "tablet",
      price: 4.5,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    // 3. Cetirizine 10mg
    {
      name: "Cetirizine 10mg",
      description: "Antihistamine for allergy relief",
      brand: "Zyrtec",
      category: "Allergy",
      image: "https://example.com/cetirizine.jpg",
      unit: "tablet",
      price: 3.25,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    // 4. Omeprazole 20mg
    {
      name: "Omeprazole 20mg",
      description: "Proton pump inhibitor for acid reflux",
      brand: "Prilosec",
      category: "Digestive Health",
      image: "https://example.com/omeprazole.jpg",
      unit: "capsule",
      price: 5.75,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    // 5. Loratadine 10mg
    {
      name: "Loratadine 10mg",
      description: "Non-drowsy allergy relief",
      brand: "Claritin",
      category: "Allergy",
      image: "https://example.com/loratadine.jpg",
      unit: "tablet",
      price: 3.99,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    // 6. Simvastatin 20mg
    {
      name: "Simvastatin 20mg",
      description: "Cholesterol-lowering medication",
      brand: "Zocor",
      category: "Cardiovascular",
      image: "https://example.com/simvastatin.jpg",
      unit: "tablet",
      price: 7.25,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    // 7. Metformin 500mg
    {
      name: "Metformin 500mg",
      description: "Oral diabetes medicine",
      brand: "Glucophage",
      category: "Diabetes",
      image: "https://example.com/metformin.jpg",
      unit: "tablet",
      price: 4.2,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    // 8. Amoxicillin 500mg
    {
      name: "Amoxicillin 500mg",
      description: "Antibiotic for bacterial infections",
      brand: "Generic",
      category: "Antibiotic",
      image: "https://example.com/amoxicillin.jpg",
      unit: "capsule",
      price: 6.5,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    // 9. Losartan 50mg
    {
      name: "Losartan 50mg",
      description: "Blood pressure medication",
      brand: "Cozaar",
      category: "Cardiovascular",
      image: "https://example.com/losartan.jpg",
      unit: "tablet",
      price: 5.99,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    // 10. Atorvastatin 10mg
    {
      name: "Atorvastatin 10mg",
      description: "Statin for high cholesterol",
      brand: "Lipitor",
      category: "Cardiovascular",
      image: "https://example.com/atorvastatin.jpg",
      unit: "tablet",
      price: 8.25,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    // 11. Pantoprazole 40mg
    {
      name: "Pantoprazole 40mg",
      description: "Proton pump inhibitor for GERD",
      brand: "Protonix",
      category: "Digestive Health",
      image: "https://example.com/pantoprazole.jpg",
      unit: "tablet",
      price: 6.75,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    // 12. Levothyroxine 50mcg
    {
      name: "Levothyroxine 50mcg",
      description: "Thyroid hormone replacement",
      brand: "Synthroid",
      category: "Hormonal",
      image: "https://example.com/levothyroxine.jpg",
      unit: "tablet",
      price: 4.8,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    // 13. Azithromycin 250mg
    {
      name: "Azithromycin 250mg",
      description: "Macrolide antibiotic",
      brand: "Zithromax",
      category: "Antibiotic",
      image: "https://example.com/azithromycin.jpg",
      unit: "tablet",
      price: 9.5,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    // 14. Sertraline 50mg
    {
      name: "Sertraline 50mg",
      description: "SSRI antidepressant",
      brand: "Zoloft",
      category: "Mental Health",
      image: "https://example.com/sertraline.jpg",
      unit: "tablet",
      price: 7.99,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    // 15. Montelukast 10mg
    {
      name: "Montelukast 10mg",
      description: "Leukotriene receptor antagonist for asthma",
      brand: "Singulair",
      category: "Respiratory",
      image: "https://example.com/montelukast.jpg",
      unit: "tablet",
      price: 6.25,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    // 16. Escitalopram 10mg
    {
      name: "Escitalopram 10mg",
      description: "SSRI for depression and anxiety",
      brand: "Lexapro",
      category: "Mental Health",
      image: "https://example.com/escitalopram.jpg",
      unit: "tablet",
      price: 8.5,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    // 17. Fluoxetine 20mg
    {
      name: "Fluoxetine 20mg",
      description: "SSRI antidepressant",
      brand: "Prozac",
      category: "Mental Health",
      image: "https://example.com/fluoxetine.jpg",
      unit: "capsule",
      price: 5.25,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    // 18. Ciprofloxacin 500mg
    {
      name: "Ciprofloxacin 500mg",
      description: "Fluoroquinolone antibiotic",
      brand: "Cipro",
      category: "Antibiotic",
      image: "https://example.com/ciprofloxacin.jpg",
      unit: "tablet",
      price: 7.75,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    // 19. Hydrochlorothiazide 25mg
    {
      name: "Hydrochlorothiazide 25mg",
      description: "Diuretic for high blood pressure",
      brand: "Microzide",
      category: "Cardiovascular",
      image: "https://example.com/hydrochlorothiazide.jpg",
      unit: "tablet",
      price: 3.5,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    // 20. Alprazolam 0.5mg
    {
      name: "Alprazolam 0.5mg",
      description: "Benzodiazepine for anxiety",
      brand: "Xanax",
      category: "Mental Health",
      image: "https://example.com/alprazolam.jpg",
      unit: "tablet",
      price: 10.99,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    // 21. Metoprolol 50mg
    {
      name: "Metoprolol 50mg",
      description: "Beta blocker for high blood pressure",
      brand: "Lopressor",
      category: "Cardiovascular",
      image: "https://example.com/metoprolol.jpg",
      unit: "tablet",
      price: 5.45,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    // 22. Tramadol 50mg
    {
      name: "Tramadol 50mg",
      description: "Opioid pain reliever",
      brand: "Ultram",
      category: "Pain Relief",
      image: "https://example.com/tramadol.jpg",
      unit: "tablet",
      price: 12.5,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    // 23. Gabapentin 300mg
    {
      name: "Gabapentin 300mg",
      description: "Anticonvulsant for nerve pain",
      brand: "Neurontin",
      category: "Neurological",
      image: "https://example.com/gabapentin.jpg",
      unit: "capsule",
      price: 6.99,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    {
      name: "Lisinopril 10mg",
      description: "ACE inhibitor for blood pressure",
      brand: "Prinivil",
      category: "Cardiovascular",
      image: "https://example.com/lisinopril.jpg",
      unit: "tablet",
      price: 4.25,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    {
      name: "Clonazepam 1mg",
      description: "Benzodiazepine for seizures and anxiety",
      brand: "Klonopin",
      category: "Neurological",
      image: "https://example.com/clonazepam.jpg",
      unit: "tablet",
      price: 9.75,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },

    {
      name: "Prednisone 10mg",
      description: "Corticosteroid for inflammation",
      brand: "Deltasone",
      category: "Steroid",
      image: "https://example.com/prednisone.jpg",
      unit: "tablet",
      price: 5.5,
      vendorOrgId: "f0238ce0-28d3-43fd-916e-e918d84f23ea",
    },
  ];

  // const createdProducts = await Promise.all(
  //   products.map((product) =>
  //     prisma.product.create({
  //       data: {
  //         ...product,
  //         vendorOrgId: vendorOrg.id,
  //       },
  //     })
  //   )
  // );
  // console.log(`Created ${createdProducts.length} products`);

  // 4. Create some inventory items in the pharmacy
  //   const inventoryItems = await Promise.all(
  //     createdProducts.map((product) =>
  //       prisma.inventoryItem.create({
  //         data: {
  //           productId: product.id,
  //           pharmacyOutletId: pharmacyOutlet.id,
  //           stock: 100,
  //           threshold: 20,
  //           expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
  //           batchNumber: `BATCH-${Math.floor(Math.random() * 10000)}`,
  //         },
  //       })
  //     )
  //   );
  //   console.log(`Created ${inventoryItems.length} inventory items`);

  //   // 5. Optionally create a sample order
  //   const order = await prisma.order.create({
  //     data: {
  //       userId: pharmacyUser.id,
  //       pharmacyOutletId: pharmacyOutlet.id,
  //       vendorOrgId: vendorOrg.id,
  //       orderDate: new Date(),
  //       orderStatus: OrderStatus.PENDING,
  //       paymentStatus: PaymentStatus.PENDING,
  //       paymentMethod: PaymentMethod.UPI,
  //       amount: 45.72,
  //       blockchainTxHash: "0xOrderTxHash12345",
  //       orderItems: {
  //         create: [
  //           {
  //             productId: createdProducts[0].id,
  //             quantity: 5,
  //             price: createdProducts[0].price,
  //           },
  //           {
  //             productId: createdProducts[1].id,
  //             quantity: 3,
  //             price: createdProducts[1].price,
  //           },
  //         ],
  //       },
  //     },
  //   });
  //   console.log(`Created sample order with id: ${order.id}`);

  //   // 6. Create blockchain record for the order
  //   await prisma.blockchainRecord.create({
  //     data: {
  //       txHash: order.blockchainTxHash,
  //       orderId: order.id,
  //       action: "ORDER_CREATED",
  //     },
  //   });
  //   console.log("Created blockchain record for the order");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
