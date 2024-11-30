"use server";

import { BlogSchema } from "@/schemas";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { decode } from "base64-arraybuffer";

interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  previewUrl: string;
  url: string;
}

interface newBlogProps extends z.infer<typeof BlogSchema> {
  base64Image: string | undefined;
  spotifyTrack?: SpotifyTrack;
  userId: string;
};

// ブログ投稿
export const newBlog = async (values: newBlogProps) => {
  try {
    const supabase = createClient();

    let image_url = "";

    if (values.base64Image) {
      const matches = values.base64Image.match(/^data:(.+);base64,(.+)$/);

      if (!matches || matches.length !== 3) {
        return { error: "無効な画像データです。"};
      }

      const contentType = matches[1];
      const base64Data = matches[2];

      // 拡張子を取得
      const fileExt = contentType.split("/")[1];
      
      // ファイル名を生成
      const fileName = `${uuidv4()}.${fileExt}`;

      const { error: storageError } = await supabase.storage
        .from("blogs")
        .upload(`${values.userId}/${fileName}`, decode(base64Data), {
          contentType,
        });

      if (storageError) {
        return { error: storageError.message };
      }

      // 画像のURLを取得
      const { data: urlData } = supabase.storage
        .from("blogs")
        .getPublicUrl(`${values.userId}/${fileName}`);

      image_url = urlData.publicUrl;
    }

    // ブログ新規作成（Spotify情報を追加）
    const { error: insertError } = await supabase.from("blogs").insert({
      title: values.title,
      content: values.content,
      image_url,
      user_id: values.userId,
      spotify_track_id: values.spotifyTrack?.id,
      spotify_track_name: values.spotifyTrack?.name,
      spotify_track_artist: values.spotifyTrack?.artist,
      spotify_track_image: values.spotifyTrack?.imageUrl,
      spotify_track_preview: values.spotifyTrack?.previewUrl,
      spotify_track_url: values.spotifyTrack?.url,
    });

    // エラーチェック
    if (insertError) {
      return { error: insertError.message };
    }
  } catch (error) {
    console.error(error);
    return { error: "ブログ投稿に失敗しました。" };
  }
};

interface editBlogProps extends z.infer<typeof BlogSchema> {
  blogId: string;
  imageUrl: string | null;
  base64Image: string | undefined;
  spotifyTrack?: SpotifyTrack;
  userId: string;
};

// ブログ編集
export const editBlog = async (values: editBlogProps) => {
  try {
    const supabase = createClient();

    let image_url = values.imageUrl;

    if (values.base64Image) {
      const matches = values.base64Image.match(/^data:(.+);base64,(.+)$/);

      if (!matches || matches.length !== 3) {
        return { error: "無効な画像データです。" };
      }

      const contentType = matches[1];
      const base64Data = matches[2];

      // 拡張子を取得
      const fileExt = contentType.split("/")[1];


      // ファイル名を生成
      const fileName = `${uuidv4()}.${fileExt}`;

      const { error: storageError } = await supabase.storage
        .from("blogs")
        .upload(`${values.userId}/${fileName}`, decode(base64Data), {
          contentType,
        });

      if (storageError) {
        return { error: storageError.message };
      }

      if (image_url) {
        const fileName = image_url.split("/").slice(-1)[0];

        // 古い画像を削除
        await supabase.storage.from("blogs").remove([`${values.userId}/${fileName}`]);
      }

      // 画像のURLを取得
      const { data: urlData } = supabase.storage
        .from("blogs")
        .getPublicUrl(`${values.userId}/${fileName}`);
      
      image_url = urlData.publicUrl;
    }

    // ブログ編集（Spotify情報を追加）
    const { error: updateError } = await supabase
      .from("blogs")
      .update({
        title: values.title,
        content: values.content,
        image_url,
        spotify_track_id: values.spotifyTrack?.id,
        spotify_track_name: values.spotifyTrack?.name,
        spotify_track_artist: values.spotifyTrack?.artist,
        spotify_track_image: values.spotifyTrack?.imageUrl,
        spotify_track_preview: values.spotifyTrack?.previewUrl,
      })
      .eq("id", values.blogId);

    // エラーチェック
    if (updateError) {
      return { error: updateError.message };
    }
  } catch (error) {
    console.error(error);
    return { error: "ブログ編集に失敗しました。" };
  }
};

interface deleteBlogProps {
  blogId: string;
  imageUrl: string | null;
  userId: string;
};

// ブログ削除
export const deleteBlog = async ({
  blogId,
  imageUrl,
  userId,
}: deleteBlogProps) => {
  try {
    const supabase = createClient();

    // ブログ削除
    const { error } = await supabase.from("blogs").delete().eq("id", blogId);

    if (error) {
      return { error: error.message };
    }

    if (!imageUrl) {
      return;
    }

    // ファイル名を取得
    const fileName = imageUrl.split("/").slice(-1)[0];

    // 画像を削除
    await supabase.storage.from("blogs").remove([`${userId}/${fileName}`]);
  } catch (error) {
    console.error(error);
    return { error: "ブログ削除に失敗しました。" };
  }
};