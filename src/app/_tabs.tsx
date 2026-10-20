import { Outlet, createFileRoute } from '@tanstack/react-router'
import { BottomNav } from '@/ui/layout/BottomNav';


export const Route = createFileRoute('/_tabs')({
  component: () => (
    <>
      <main className="flex-1 pb-16 lg:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </>
  ),
})