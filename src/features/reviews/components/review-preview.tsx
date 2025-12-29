export interface ReviewPreviewProps {
  id: number;
  comment?: string | null;
}

export function ReviewPreview(props: ReviewPreviewProps) {
  const { comment } = props;

  return (
    <div>
      <p>{comment}</p>
    </div>
  );
}
