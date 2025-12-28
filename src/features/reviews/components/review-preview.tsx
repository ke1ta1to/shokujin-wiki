interface ReviewPreviewProps {
  id: number;
  comment?: string | null;
}

export function ReviewPreview(props: ReviewPreviewProps) {
  const { comment } = props;

  return (
    <div className="">
      <p>{comment}</p>
    </div>
  );
}
