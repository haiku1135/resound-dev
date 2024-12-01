"use server";

import { ProfileSchema, EmailSchema } from "@/schemas";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { ProfileType } from "@/types";
import { decode } from "base64-arraybuffer";

interface updateProfileProps extends z.infer<typeof ProfileSchema> {
  profile: ProfileType;
  base64Image: string | undefined;
};

// プロフィール更新
export const updateProfile = async (values: updateProfileProps) => {
  try {
    const supabase = createClient();
    
    let avatar_url = values.profile.avatar_url;

    if (values.base64Image) {
      const matches = values.base64Image.match(/^data:(.+?);base64,(.+)$/);

      if (!matches || matches.length !== 3) {
        return { error: "無効な画像データです。"};
      }

      const contentType = matches[1]; // 画像のMIMEタイプ
      const base64Data = matches[2]; // base64データ

      // 拡張子を取得
      const fileExt = contentType.split("/")[1]; // 例: "png"
      

      // ファイル名を生成
      const fileName = `${uuidv4()}.${fileExt}`;

      // ファイルをアップロード
      const { error: storageError } = await supabase.storage
      .from("profiles")
      .upload(`avatars/${fileName}`, decode(base64Data), {
        contentType,
        upsert: true
      });

      if (storageError) {
        return { error: storageError.message };
      }

      if (avatar_url) {
        const fileName = avatar_url.split("/").slice(-1)[0];

        // 古い画像を削除
        await supabase.storage
          .from("profiles")
          .remove([`avatars/${fileName}`]);
      }
      
      // 画像のURLを取得
      const { data: urlData } = await supabase.storage
        .from("profiles")
        .getPublicUrl(`avatars/${fileName}`);
      
      avatar_url = urlData?.publicUrl;
    }

    // プロフィールアップデート
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        name: values.name,
        introduce: values.introduce,
        avatar_url,
      })
      .eq("id", values.profile.id);

    // エラーチェック
    if (updateError) {
      return { error: updateError.message };
    }

  } catch (error) {
    console.error(error);
    return { error: "エラーが発生しました" };
  }
};

// メールアドレス更新
export const updateEmail = async (values: z.infer<typeof EmailSchema>) => {
  try {
    const supabase = createClient();

    // メールアドレス変更メールを送信
    const { error: updateUserError } = await supabase.auth.updateUser(
      { email: values.email},
      { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/email/verify` }
    );

    if (updateUserError) {
      return { error: updateUserError.message };
    }

    // ログアウト
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      return { error: signOutError.message };
    }
  } catch (error) {
    console.error(error);
    return { error: "エラーが発生しました" };
  }
}