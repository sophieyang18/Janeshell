import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="glass-card max-w-xl p-10 text-center">
        <div className="text-xs uppercase tracking-[0.28em] text-slate-400">404</div>
        <h1 className="mt-3 text-5xl font-black text-slate-950">这一页还没被简贝接管</h1>
        <p className="mt-4 text-base leading-7 text-slate-500">你现在访问的路由不存在，先回到横版工作台继续看搭子、记录和任务。</p>
        <Link to="/" className="pill-button mt-6 bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700">
          回到首页
        </Link>
      </div>
    </div>
  );
}
