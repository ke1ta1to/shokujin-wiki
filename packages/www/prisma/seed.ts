import { PrismaClient } from "@/generated/prisma";
import type { Prisma } from "@/generated/prisma";

const prisma = new PrismaClient();

// ユーザーデータ（5人）
const userData: Prisma.UserCreateInput[] = [
  {
    authId: "auth-user-001",
    name: "田中太郎",
  },
  {
    authId: "auth-user-002",
    name: "山田花子",
  },
  {
    authId: "auth-user-003",
    name: "佐藤次郎",
  },
  {
    authId: "auth-user-004",
    name: "鈴木美香",
  },
  {
    authId: "auth-user-005",
    name: "高橋健一",
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
      "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800&q=80",
    ],
    userAuthId: "auth-user-001",
    productName: "特製ラーメン",
  },
  {
    comment: "パラパラでちょうど良い味付け。具材も豊富で満足感があります。",
    imageUrls: [
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80",
    ],
    userAuthId: "auth-user-002",
    productName: "チャーハン",
  },
  {
    comment: "皮がもちもちで中身がジューシー。タレとの相性も抜群です。",
    imageUrls: [
      "https://images.unsplash.com/photo-1609183480237-ccbb2d7c5772?w=800&q=80",
    ],
    userAuthId: "auth-user-003",
    productName: "餃子（6個）",
  },
  {
    comment: "唐揚げがサクサクで美味しい！ボリュームも満点で大満足です。",
    imageUrls: [
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&q=80",
    ],
    userAuthId: "auth-user-001",
    productName: "唐揚げ定食",
  },
  {
    comment: "スパイスが効いていて本格的な味。野菜も多くて健康的です。",
    imageUrls: [
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80",
    ],
    userAuthId: "auth-user-004",
    productName: "カレーライス",
  },
  {
    comment: "ラーメンが絶品！また必ず来ます。店員さんも親切でした。",
    imageUrls: [],
    userAuthId: "auth-user-005",
    productName: "特製ラーメン",
  },
  {
    comment:
      "バンズがふわふわで肉汁たっぷり。ポテトもサクサクで美味しかったです。",
    imageUrls: [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    ],
    userAuthId: "auth-user-002",
    productName: "ハンバーガーセット",
  },
  {
    comment: "新鮮なネタで握りも丁寧。特にマグロが絶品でした。",
    imageUrls: [
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80",
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
    imageUrls: [
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
    ],
    userAuthId: "auth-user-005",
    productName: "パスタボロネーゼ",
  },
];

// 記事データ
const articleData: Array<{
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  userAuthId: string;
  relatedProducts: string[]; // 商品名の配列
  isMainArticleFor?: string; // この記事がメイン記事となる商品名
}> = [
  {
    title: "当店人気No.1！特製ラーメンの魅力を徹底解説",
    slug: "special-ramen-guide",
    content: `# 当店人気No.1！特製ラーメンの魅力を徹底解説

## はじめに

当店の看板メニューである「特製ラーメン」は、創業以来多くのお客様にご愛顧いただいている自慢の一品です。今回は、その魅力を余すところなくお伝えします。

## こだわりのスープ

### 豚骨と鶏ガラの黄金比

当店のスープは、豚骨と鶏ガラを絶妙なバランスで配合しています。

- **豚骨**：国産豚の厳選された部位を使用
- **鶏ガラ**：地元養鶏場から毎朝届く新鮮なものだけを使用
- **煮込み時間**：12時間以上かけてじっくりと

### 香味野菜の役割

スープの深みを出すために、以下の香味野菜を使用しています：

1. にんにく（青森県産）
2. 生姜（高知県産）
3. 長ネギ（地元産）

## 自家製チャーシューの秘密

当店のチャーシューは、低温調理法を採用しています。

### 調理工程
1. 国産豚肩ロースを特製タレに一晩漬け込む
2. 65度で3時間かけてじっくりと火を通す
3. 表面を香ばしく炙って提供

この調理法により、とろけるような食感と肉の旨味を最大限に引き出しています。

## お客様の声

> 「こんな美味しいラーメンは初めて！」（30代男性）

> 「週に3回は通っています」（40代女性）

> 「チャーシューが絶品です」（20代男性）

## まとめ

特製ラーメンは、素材・調理法・提供方法すべてにこだわり抜いた一品です。ぜひ一度ご賞味ください。

---

*この記事を読んで特製ラーメンが食べたくなった方は、ぜひご来店ください！*`,
    isPublished: true,
    userAuthId: "auth-user-001",
    relatedProducts: ["特製ラーメン", "チャーハン"],
    isMainArticleFor: "特製ラーメン", // 特製ラーメンのメイン記事
  },
  {
    title: "【完全保存版】当店の餃子が美味しい5つの理由",
    slug: "gyoza-5-reasons",
    content: `# 【完全保存版】当店の餃子が美味しい5つの理由

当店の餃子は、1日平均800個以上売れる人気メニューです。なぜこれほどまでに愛されているのか、その理由を5つご紹介します。

## 1. すべて手作りのもちもち皮

### 独自配合の生地
- 強力粉と薄力粉を独自の比率でブレンド
- 熱湯でこねることで、もちもちとした食感を実現
- 毎日500枚以上を手作業で製造

## 2. 黄金比率の餡

当店の餡は、長年の研究により生まれた黄金比率で作られています。

| 材料 | 比率 |
|------|------|
| 豚ひき肉 | 60% |
| キャベツ | 25% |
| ニラ | 10% |
| 調味料 | 5% |

## 3. こだわりの焼き方

### 三段階調理法
1. **強火で底面をカリッと**（約2分）
2. **蒸し焼きでジューシーに**（中火で5分）
3. **仕上げの香ばしさ**（ごま油で風味付け）

## 4. 選べるカスタマイズ

お客様の好みに合わせて調整可能：
- ニンニクの有無
- 辛さの調整（通常・ピリ辛・激辛）

## 5. 相性抜群のタレ

### 基本のタレ
- 醤油：大さじ2
- 酢：大さじ1
- ラー油：お好みで

### アレンジタレもご用意
- さっぱり派：ポン酢＋大根おろし
- こってり派：味噌＋マヨネーズ＋七味

## お客様からの評価

⭐⭐⭐⭐⭐ 4.8/5.0（500件以上のレビュー）

## 最後に

外はカリッと、中はジューシー。一口噛めば肉汁があふれ出す、至福の餃子体験をお約束します。特に金曜日の夜は品切れになることも多いので、お早めのご注文をおすすめします！`,
    isPublished: true,
    userAuthId: "auth-user-002",
    relatedProducts: ["餃子（6個）"],
    isMainArticleFor: "餃子（6個）", // 餃子のメイン記事
  },
  {
    title: "スパイスカレーの奥深い世界へようこそ",
    slug: "spice-curry-world",
    content: `# スパイスカレーの奥深い世界へようこそ

## スパイスカレーとは

スパイスカレーは、単なるカレーではありません。15種類以上のスパイスを独自にブレンドした、香り豊かで奥深い味わいの料理です。

## 当店のスパイスブレンド

### ベーススパイス（全体の60%）
- **クミン**：香ばしさとコクの基盤
- **コリアンダー**：さわやかな香りと甘み
- **ターメリック**：美しい黄金色と健康効果
- **フェヌグリーク**：ほろ苦さと深み

### 健康効果も期待できる

スパイスには様々な健康効果があります：
- ターメリック：抗炎症作用
- クミン：消化促進
- コリアンダー：血糖値調整

## おすすめの食べ方

1. 最初の一口はカレーのみで
2. ライスと混ぜてスパイスの調和を
3. 福神漬けやらっきょうで味変を
4. 最後にラッシーでリセット

ぜひ一度、スパイスの魔法をご体験ください。`,
    isPublished: true,
    userAuthId: "auth-user-003",
    relatedProducts: ["カレーライス"],
  },
  {
    title: "新商品開発中！ハンバーガーセットについて",
    slug: "new-hamburger-development",
    content: `# 新商品開発中！ハンバーガーセットについて

現在、新商品のハンバーガーセットを開発中です。

## コンセプト
- 100%ビーフパティ
- 自家製バンズ
- 新鮮野菜たっぷり

詳細は後日発表予定です。お楽しみに！`,
    isPublished: false, // 下書き
    userAuthId: "auth-user-003",
    relatedProducts: ["ハンバーガーセット"],
  },
  {
    title: "食材へのこだわり〜地産地消の取り組み〜",
    slug: "local-ingredients-commitment",
    content: `# 食材へのこだわり〜地産地消の取り組み〜

## はじめに

当店では、地元の農家さんや漁師さんと協力し、新鮮で安全な食材を使用しています。

## 野菜

### 契約農家

- 田中農園：キャベツ、白菜、ネギ
- 山田ファーム：トマト、きゅうり、ピーマン
- 鈴木農場：じゃがいも、にんじん、玉ねぎ

毎朝6時に収穫したばかりの野菜が届きます。

## 肉類

### 国産へのこだわり

すべての肉類は国産を使用。特に豚肉は、ストレスの少ない環境で育てられた銘柄豚を厳選しています。

- 豚肉：○○県産ブランド豚
- 鶏肉：△△地鶏
- 牛肉：国産黒毛和牛

## 魚介類

地元漁港から直送される新鮮な魚介類を使用。その日の朝に水揚げされたものだけを仕入れています。

## まとめ

食材一つひとつにこだわることで、お客様に安心・安全で美味しい料理をご提供できると信じています。`,
    isPublished: true,
    userAuthId: "auth-user-004",
    relatedProducts: [], // 商品に紐づかない記事
  },
  {
    title: "当店の歴史〜創業から現在まで〜",
    slug: "restaurant-history",
    content: `# 当店の歴史〜創業から現在まで〜

## 1985年 - 創業

小さな屋台から始まった当店。創業者の「本当に美味しいラーメンを作りたい」という想いからスタートしました。

## 1990年 - 初の実店舗オープン

常連のお客様に支えられ、ついに実店舗をオープン。10席からのスタートでした。

## 2000年 - メニューの拡充

ラーメンだけでなく、餃子、チャーハンなど定番メニューを追加。

## 2010年 - リニューアル

店舗を全面改装。席数も30席に拡大し、より多くのお客様をお迎えできるようになりました。

## 2020年 - 新たな挑戦

コロナ禍を乗り越え、テイクアウトメニューも充実。新しい時代のニーズに対応しています。

## 現在

創業から約40年。変わらぬ味を守りながら、新しい挑戦も続けています。これからも地域の皆様に愛される店を目指して。`,
    isPublished: true,
    userAuthId: "auth-user-005",
    relatedProducts: [], // 商品に紐づかない記事
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

    // 4. 記事をupsert
    const articles = [];
    for (const article of articleData) {
      const user = await prisma.user.findUnique({
        where: { authId: article.userAuthId },
      });

      if (!user) {
        console.error(`Failed to find user for article: ${article.title}`);
        continue;
      }

      // slugで既存記事を検索
      const existingArticle = await prisma.article.findUnique({
        where: { slug: article.slug },
      });

      let upsertedArticle;
      if (existingArticle) {
        // 既存記事を更新
        upsertedArticle = await prisma.article.update({
          where: { id: existingArticle.id },
          data: {
            title: article.title,
            content: article.content,
            isPublished: article.isPublished,
            userId: user.id,
          },
        });
        // 既存の関連商品を削除
        await prisma.articleProduct.deleteMany({
          where: { articleId: existingArticle.id },
        });
      } else {
        // 新規記事作成
        upsertedArticle = await prisma.article.create({
          data: {
            title: article.title,
            slug: article.slug,
            content: article.content,
            isPublished: article.isPublished,
            userId: user.id,
          },
        });
      }

      // 関連商品を追加
      for (const productName of article.relatedProducts) {
        const product = await prisma.product.findFirst({
          where: { name: productName },
        });

        if (product) {
          await prisma.articleProduct.create({
            data: {
              articleId: upsertedArticle.id,
              productId: product.id,
            },
          });
        } else {
          console.warn(
            `Product not found for article relation: ${productName}`,
          );
        }
      }

      articles.push(upsertedArticle);

      // この記事をメイン記事として設定する商品がある場合
      if (article.isMainArticleFor) {
        const mainProduct = await prisma.product.findFirst({
          where: { name: article.isMainArticleFor },
        });

        if (mainProduct) {
          await prisma.product.update({
            where: { id: mainProduct.id },
            data: { mainArticleId: upsertedArticle.id },
          });
          console.log(
            `Set article "${article.title}" as main article for product "${article.isMainArticleFor}"`,
          );
        }
      }
    }
    console.log(`Upserted ${articles.length} articles`);

    const verifiedProducts = products.filter((p) => p.isVerified).length;
    const publishedArticles = articles.filter((a) => a.isPublished).length;
    console.log("Seed data creation completed");
    console.log(
      `Summary: ${users.length} users, ${products.length} products (${verifiedProducts} verified), ${reviews.length} reviews, ${articles.length} articles (${publishedArticles} published)`,
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
