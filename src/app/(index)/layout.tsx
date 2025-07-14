import { NewReviewButton } from "@/components/new-review-button";

export default async function IndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <NewReviewButton />
    </>
  );
}
