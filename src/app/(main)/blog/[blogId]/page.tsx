import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import Loading from "@/app/loading";
import BlogDetail from "@/components/blog/BlogDetail";
import { Metadata } from 'next';

interface BlogDetailPageProps {
  params: {
    blogId: string;
  }
};

// 動的メタデータの生成
export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { blogId } = params;
  const supabase = createClient();

  // ブログ詳細取得
  const { data: blogData } = await supabase
    .from("blogs")
    .select(`
      title,
      content,
      image_url
    `)
    .eq("id", blogId)
    .single();

  if (!blogData) {
    return {
      title: "ブログが見つかりません | RESOUND",
    };
  }

  return {
    title: `${blogData.title} | RESOUND`,
    description: blogData.content.substring(0, 100),
    openGraph: {
      title: blogData.title,
      description: blogData.content.substring(0, 100),
      images: blogData.image_url ? [blogData.image_url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blogData.title,
      description: blogData.content.substring(0, 100),
      images: blogData.image_url ? [blogData.image_url] : [],
    },
  };
}

const BlogDetailPage = async ({ params }: BlogDetailPageProps) => {
  const { blogId } = params;
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  // ブログ詳細取得
  const { data: blogData } = await supabase
    .from("blogs")
    .select(
      `
        *,
        profiles(
          name,
          avatar_url,
          introduce
        )
      `
    )
    .eq("id", blogId)
    .single();
  
  if (!blogData) {
    return <div className="text-center">ブログが存在しません</div>
  }

  // ログインユーザーがブログ作成者かどうか
  const isMyBlog = user?.id === blogData.user_id;

  return (
    <Suspense fallback={<Loading />}>
      <BlogDetail blog={blogData} isMyBlog={isMyBlog} />
    </Suspense>
  );
};

export default BlogDetailPage;