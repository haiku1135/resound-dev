import { z } from "zod";

export const SignupSchema = z.object({
  name: z.string().min(1, {
    message: "お名前を入力してください",
  }),
  email: z.string().email({
    message: "メールアドレスを入力してください",
  }),
  password: z.string().min(8, {
    message: "英数字8文字以上で入力してください",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "メールアドレスを入力してください",
  }),
  password: z.string().min(8, {
    message: "英数字8文字以上で入力してください",
  }),
});


export const ResetPasswordSchema = z.object({
  email: z.string().email({
    message: "メールアドレスを入力してください",
  }),
});

export const PasswordSchema = z.object({
  password: z.string().min(8, { message: "英数字8文字以上で入力してください" }),
  confirmation: z.string().min(8, { message: "英数字8文字以上で入力してください" }),
})
.refine((data) => data.password === data.confirmation, {
  message: "新しいパスワードと確認用パスワードが一致しません。",
  path: ["confirmation"],
});

export const ProfileSchema = z.object({
  name: z.string().min(1, { message: "名前を入力してください" }),
  introduce: z.string().optional(),
});

export const EmailSchema = z.object({
  email: z.string().email({message: "メールアドレスを入力してください"}),
});

export const BlogSchema = z.object({
  title: z.string().min(1, {message: "タイトルを入力してください"}),
  content: z.string().min(1, {message: "内容を入力してください"}),
  spotifyTrack: z.object({
    id: z.string(),
    name: z.string(),
    artist: z.string(),
    imageUrl: z.string(),
    previewUrl: z.string(),
  }).optional(),
});