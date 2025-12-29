"use client";

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

export interface ReviewUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewUploadDialog(props: ReviewUploadDialogProps) {
  const { open, onOpenChange } = props;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  const queryClient = useQueryClient();
  const { mutate } = $api.useMutation("post", "/reviews", {
    onSuccess() {
      onOpenChange(false);
      toast.success("レビューを投稿しました");
      form.reset();
      queryClient.refetchQueries({
        queryKey: $api.queryOptions("get", "/reviews").queryKey,
      });
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    mutate({ body: { comment: data.comment } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>レビューを投稿</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <form id="review-upload-form" onSubmit={form.handleSubmit(onSubmit)}>
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
          <Button type="submit" form="review-upload-form">
            投稿する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
