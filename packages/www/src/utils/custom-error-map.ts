import { z, ZodParsedType } from "zod";

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.received === ZodParsedType.undefined) {
      return { message: "必須" };
    } else {
      return { message: "無効な値" };
    }
  }
  if (issue.code === z.ZodIssueCode.invalid_string) {
    if (issue.validation === "email") {
      return { message: "メールアドレスの形式が無効です" };
    }
  }
  if (issue.code === z.ZodIssueCode.too_small) {
    if (issue.type === "string") {
      if (!issue.exact) {
        return { message: `${issue.minimum}文字以上必要です` };
      }
    }
  }
  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);
