"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@supabase/supabase-js";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.email("有効なメールアドレスを入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください"),
});

export function SignInForm() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { email, password } = data;
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.log(error);
      form.setError("root", {
        message:
          "ログインに失敗しました。メールアドレスとパスワードを確認してください。",
      });
    }
    console.log({ user });
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>ログイン</CardTitle>
      </CardHeader>
      <CardContent>
        {form.formState.errors.root && (
          <Field data-invalid>
            <FieldError
              errors={[form.formState.errors.root]}
              className="mb-4"
            />
          </Field>
        )}
        <form id="sign-in-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sign-in-form-email">
                    メールアドレス
                  </FieldLabel>
                  <Input
                    {...field}
                    id="sign-in-form-email"
                    aria-invalid={fieldState.invalid}
                    type="email"
                    name="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sign-in-form-password">
                    パスワード
                  </FieldLabel>
                  <Input
                    {...field}
                    id="sign-in-form-password"
                    aria-invalid={fieldState.invalid}
                    type="password"
                    name="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="submit" form="sign-in-form">
            ログイン
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
