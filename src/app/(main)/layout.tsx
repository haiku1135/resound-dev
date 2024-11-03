interface MainLayoutProps {
  // 子要素
  children: React.ReactNode
}

// main layout
const MainLayout = async ({ children }: MainLayoutProps) => {
  // メインコンテンツ
  return <div className="mx-auto max-w-screen-lg px-2 my-10">{children}</div>
}

export default MainLayout