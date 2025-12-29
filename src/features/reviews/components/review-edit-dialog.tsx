import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { $api } from "@/lib/api-client";

const formSchema = z.object({
  comment: z.string(),
});

export interface ReviewEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewId: number;
  defaultValues?: z.infer<typeof formSchema>;
}

export function ReviewEditDialog(props: ReviewEditDialogProps) {
  const { open, onOpenChange, reviewId, defaultValues } = props;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      comment: "",
    },
  });

  const queryClient = useQueryClient();
  const { mutate } = $api.useMutation("patch", "/reviews/{id}", {
    onSuccess() {
      onOpenChange(false);
      toast.success("レビューを編集しました");
      form.reset();
      queryClient.refetchQueries({
        queryKey: $api.queryOptions("get", "/reviews").queryKey,
      });
      queryClient.refetchQueries({
        queryKey: $api.queryOptions("get", "/reviews/{id}", {
          params: { path: { id: reviewId } },
        }).queryKey,
      });
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    mutate({
      params: { path: { id: reviewId } },
      body: { comment: data.comment },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>レビュー編集</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <form id="review-edit-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="comment"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="review-upload-form-comment">
                    コメント
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="review-upload-form-comment"
                    aria-invalid={fieldState.invalid}
                    className="max-h-32"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button type="submit" form="review-edit-form">
            編集する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
