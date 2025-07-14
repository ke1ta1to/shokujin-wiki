import { PrismaClient } from "@/generated/prisma";
import type { Prisma } from "@/generated/prisma";

const prisma = new PrismaClient();

// ユーザーデータ（5人）
const userData: Prisma.UserCreateInput[] = [
  {
    authId: "auth-user-001",
  },
  {
    authId: "auth-user-002",
  },
  {
    authId: "auth-user-003",
  },
  {
    authId: "auth-user-004",
  },
  {
    authId: "auth-user-005",
  },
];

// 商品データ（8個）
const productData: Array<{
  name: string;
  price: number;
  isVerified: boolean;
  userId?: number;
}> = [
  {
    name: "特製ラーメン",
    price: 980,
    isVerified: true,
    userId: 1,
  },
  {
    name: "チャーハン",
    price: 750,
    isVerified: true,
  },
  {
    name: "餃子（6個）",
    price: 450,
    isVerified: true,
  },
  {
    name: "唐揚げ定食",
    price: 1200,
    isVerified: false,
    userId: 2,
  },
  {
    name: "カレーライス",
    price: 850,
    isVerified: true,
  },
  {
    name: "ハンバーガーセット",
    price: 1100,
    isVerified: false,
    userId: 3,
  },
  {
    name: "寿司盛り合わせ",
    price: 2500,
    isVerified: true,
  },
  {
    name: "パスタボロネーゼ",
    price: 1400,
    isVerified: true,
  },
];

// レビューデータ（10個）
const reviewData: Array<{
  comment: string;
  imageUrls: string[];
  userAuthId: string;
  productName: string;
}> = [
  {
    comment:
      "スープが濃厚で麺もコシがあって最高でした！チャーシューも柔らかくて美味しかったです。",
    imageUrls: [
      "https://example.com/ramen1.jpg",
      "https://example.com/ramen2.jpg",
    ],
    userAuthId: "auth-user-001",
    productName: "特製ラーメン",
  },
  {
    comment: "パラパラでちょうど良い味付け。具材も豊富で満足感があります。",
    imageUrls: ["https://example.com/fried-rice.jpg"],
    userAuthId: "auth-user-002",
    productName: "チャーハン",
  },
  {
    comment: "皮がもちもちで中身がジューシー。タレとの相性も抜群です。",
    imageUrls: ["https://example.com/gyoza1.jpg"],
    userAuthId: "auth-user-003",
    productName: "餃子（6個）",
  },
  {
    comment: "唐揚げがサクサクで美味しい！ボリュームも満点で大満足です。",
    imageUrls: ["https://example.com/karaage.jpg"],
    userAuthId: "auth-user-001",
    productName: "唐揚げ定食",
  },
  {
    comment: "スパイスが効いていて本格的な味。野菜も多くて健康的です。",
    imageUrls: ["https://example.com/curry.jpg"],
    userAuthId: "auth-user-004",
    productName: "カレーライス",
  },
  {
    comment: "ラーメンが絶品！また必ず来ます。店員さんも親切でした。",
    imageUrls: ["https://example.com/ramen3.jpg"],
    userAuthId: "auth-user-005",
    productName: "特製ラーメン",
  },
  {
    comment:
      "バンズがふわふわで肉汁たっぷり。ポテトもサクサクで美味しかったです。",
    imageUrls: ["https://example.com/burger.jpg"],
    userAuthId: "auth-user-002",
    productName: "ハンバーガーセット",
  },
  {
    comment: "新鮮なネタで握りも丁寧。特にマグロが絶品でした。",
    imageUrls: [
      "https://example.com/sushi1.jpg",
      "https://example.com/sushi2.jpg",
    ],
    userAuthId: "auth-user-003",
    productName: "寿司盛り合わせ",
  },
  {
    comment: "餃子の皮がもちもちで癖になります。また注文したいです。",
    imageUrls: [],
    userAuthId: "auth-user-004",
    productName: "餃子（6個）",
  },
  {
    comment: "パスタのアルデンテ具合が絶妙。ソースも濃厚で美味しかったです。",
    imageUrls: ["https://example.com/pasta.jpg"],
    userAuthId: "auth-user-005",
    productName: "パスタボロネーゼ",
  },
];

async function main() {
  console.log("Starting seed data creation...");

  try {
    // 1. ユーザーをupsert
    const users = [];
    for (const user of userData) {
      const upsertedUser = await prisma.user.upsert({
        where: { authId: user.authId },
        update: {},
        create: user,
      });
      users.push(upsertedUser);
    }
    console.log(`Upserted ${users.length} users`);

    // 2. 商品をupsert
    const products = [];
    for (const product of productData) {
      const existingProduct = await prisma.product.findFirst({
        where: { name: product.name },
      });

      let upsertedProduct;
      if (existingProduct) {
        upsertedProduct = await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            price: product.price,
            isVerified: product.isVerified,
            userId: product.userId,
          },
        });
      } else {
        upsertedProduct = await prisma.product.create({
          data: {
            name: product.name,
            price: product.price,
            isVerified: product.isVerified,
            userId: product.userId,
          },
        });
      }
      products.push(upsertedProduct);
    }
    console.log(`Upserted ${products.length} products`);

    // 3. レビューをupsert
    const reviews = [];
    for (const review of reviewData) {
      const user = await prisma.user.findUnique({
        where: { authId: review.userAuthId },
      });
      const product = await prisma.product.findFirst({
        where: { name: review.productName },
      });

      if (!user || !product) {
        console.error(
          `Failed to find user or product for review: ${review.comment.substring(0, 50)}...`,
        );
        continue;
      }

      const existingReview = await prisma.review.findFirst({
        where: {
          userId: user.id,
          productId: product.id,
          comment: review.comment,
        },
      });

      let upsertedReview;
      if (existingReview) {
        upsertedReview = await prisma.review.update({
          where: { id: existingReview.id },
          data: {
            imageUrls: review.imageUrls,
          },
        });
      } else {
        upsertedReview = await prisma.review.create({
          data: {
            comment: review.comment,
            imageUrls: review.imageUrls,
            userId: user.id,
            productId: product.id,
          },
        });
      }
      reviews.push(upsertedReview);
    }
    console.log(`Upserted ${reviews.length} reviews`);

    const verifiedProducts = products.filter((p) => p.isVerified).length;
    console.log("Seed data creation completed");
    console.log(
      `Summary: ${users.length} users, ${products.length} products (${verifiedProducts} verified), ${reviews.length} reviews`,
    );
  } catch (error) {
    console.error("Error during seed data creation:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("Seed process failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
