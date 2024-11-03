"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { BlogSchema } from "@/schemas";
import { newBlog } from "@/actions/blog";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import FormError from "@/components/auth/FormError";
import ImageUploading, { ImageListType } from "react-images-uploading";

interface BlogNewProps {
  userId: string;
};

const BlogNew = ({ userId }: BlogNewProps) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [imageUpload, setImageUpload] = useState<ImageListType>([]);

  const form = useForm<z.infer<typeof BlogSchema>>({
    resolver: zodResolver(BlogSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  // 送信
  const onSubmit = (values: z.infer<typeof BlogSchema>) => {
    setError("");

    let base64Image: string | undefined;

    startTransition(async () => {
      try {
        if (imageUpload.length) {
          base64Image = imageUpload[0].dataURL;
        }

        const res = await newBlog({
          ...values,
          base64Image,
          userId,
        });

        if (res?.error) {
          setError(res.error);
          return;
        }

        toast.success("ブログを投稿しました。");
        router.push("/");
        router.refresh();
      } catch (error) {
        console.error(error);
        setError("エラーが発生しました。");
      }
    })
  };

  // 画像アップロード
  const onChangeImage = (imageList: ImageListType) => {
    const file = imageList[0]?.file;
    const maxFileSize = 2 * 1024 * 1024;

    if (file && file.size > maxFileSize) {
      setError("ファイルサイズは2MBを超えることは出来ません。");
      return;
    }

    setImageUpload(imageList);
  };

  return (
    <div className="mx-auto max-w-screen-md">
      <div className="font-bold text-xl text-center mb-10">ブログ投稿</div>

      <div className="mb-5">
        <ImageUploading
          value={imageUpload}
          onChange={onChangeImage}
          maxNumber={1}
          acceptType={["jpg", "jpeg", "png"]}
        >
          {({ imageList, onImageUpload, onImageUpdate, dragProps}) => (
            <div className="flex flex-col items-center justify-center">
              {imageList.length == 0 && (
                <button
                  onClick={onImageUpload}
                  className="aspect-video w-full border-2 border-dashed rounded hover:bg-gray-50"
                  {...dragProps}
                >
                  <div className="text-gray-400 font-bold mb-2 text-sm">
                    ファイル選択またはドラッグ＆ドロップ
                  </div>
                  <div className="text-gray-400 text-xs">
                    ファイル形式：jpg, jpeg, png
                  </div>
                  <div className="text-gray-400 text-xs">
                    ファイルサイズ：2MBまで
                  </div>
                </button>
              )}

              {imageList.map((image, index) => (
                <div key={index}>
                  {image.dataURL && (
                    <div className="relative">
                      <Image 
                        src={image.dataURL}
                        alt="image"
                        width={768}
                        height={432}
                        priority={true}
                      />
                    </div>
                  )}
                </div>
              ))}

              {imageList.length > 0 && (
                <div className="text-center mt-3">
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      onImageUpdate(0);
                    }}
                  >
                    画像を変更
                  </Button>
                </div>
              )}
            </div>
          )}
        </ImageUploading>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField 
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">タイトル</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField 
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">内容</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder=""
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-center">
            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending && <Loader2 className="animate-spin" />}
              <span>投稿</span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BlogNew;

