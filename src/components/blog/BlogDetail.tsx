"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BlogType } from "@/types";
import { format } from "date-fns";
import { FilePenLine, Loader2, Trash2 } from "lucide-react";
import FormError from "@/components/auth/FormError";
import Image from "next/image";
import Link from "next/link";
import { deleteBlog } from "@/actions/blog"
import toast from "react-hot-toast";

interface BlogDetailProps {
  blog: BlogType & {
    profiles: {
      name: string;
      avatar_url: string | null;
      introduce: string | null;
    }
  };
  isMyBlog: boolean;
};

const BlogDetail = ({ blog, isMyBlog }: BlogDetailProps) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const handleDelete = async () => {
    if (!window.confirm("本当に削除しますか？")) {
      return;
    }

    setError("");

    startTransition(async () => {
      try {
        const res = await deleteBlog({
          blogId: blog.id,
          imageUrl: blog.image_url,
          userId: blog.user_id,
        });

        if (res?.error) {
          setError(res.error);
          return;
        }

        toast.success("ブログを削除しました。");
        router.push("/");
        router.refresh();
      } catch (error) {
        setError("ブログ削除に失敗しました。");
      }
    });
  };

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-1 gap-5">
      <div className="col-span-2 space-y-5">
        <div className="text-sm text-gray-500">
          {format(new Date(blog.created_at), "yyyy/MM/dd HH:mm")}
        </div>
        <div className="font-bold text-2xl">{blog.title}</div>
        {blog.image_url && (
          <div>
            <Image
              src={blog.image_url || "/noImage.png"}
              className="rounded object-cover"
              alt="image"
              width={768}
              height={432}
              priority
            />
          </div>
        )}
        <div className="leading-relaxed break-words whitespace-pre-wrap">
          {blog.content}
        </div>
        {blog.spotify_track_id && (
          <div className="space-y-3">
            <h3>音楽</h3>
            <p>曲名:{blog.spotify_track_name}</p>
            <p>アーティスト:{blog.spotify_track_artist}</p>
            {blog.spotify_track_image && (
              <Image 
                src={blog.spotify_track_image} 
                alt="track jacket"
                width={300} 
                height={300} 
              />
            )}
            {blog.spotify_track_preview && (
              <audio src={blog.spotify_track_preview} controls />
            )}
            {blog.spotify_track_url && (
              <div>
                <Link 
                  href={blog.spotify_track_url}
                  target="_blank"
                  className="text-green-500 hover:text-green-600 flex items-center gap-2"
                >
                  <span>Spotifyで開く</span>
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </Link>
              </div>
            )}
          </div>
        )}
        {isMyBlog && (
          <div className="flex items-center justify-end space-x-3">
            <Link href={`/blog/${blog.id}/edit`}>
              <FilePenLine className="w-6 h-6" />
            </Link>
            <button
              className="cursor-pointer"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="w-6 h-6 animate-spin text-red-500" />
              ) : (
                <Trash2 className="w-6 h-6 text-red-500" />
              )}
            </button>
          </div>
        )}

        <FormError message={error} />
      </div>

      <div className="col-span-1">
        <div className="border rounded flex flex-col items-center justify-center space-y-2 p-5">
          <Image
            src={blog.profiles.avatar_url || "/noImage.png"}
            className="rounded-full object-cover"
            alt="avatar"
            width={100}
            height={100}
            priority
          />

          <div className="font-bold">{blog.profiles.name}</div>
          <div className="text-sm">{blog.profiles.introduce}</div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;