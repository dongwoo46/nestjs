// src/router.tsx
import {
  Router,
  Route,
  createRouter,
  createRootRoute,
  createRoute,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import HomePage from './HomePage';
import Homepage from './HomePage';
import OrderPage from './OrderPage';
import Header from '../Header';

const rootRoute = createRootRoute();

const mainRoute = createRoute({
  id: 'main',
  getParentRoute: () => rootRoute, // mainRoute는 rootRoute의 자식
  component: () => {
    return (
      <div className="flex flex-col h-screen w-full">
        <Header /> {/* 모든 페이지에 공통으로 적용되는 Header */}
        <div className="flex flex-1">
          <main className="flex-1 p-6">
            <Outlet /> {/* 자식 라우트 렌더링 */}
          </main>
        </div>
      </div>
    );
  },
});

const homeRoute = createRoute({
  getParentRoute: () => mainRoute,
  path: '/', // Home 페이지는 '/' 경로
  component: HomePage,
});

const orderRoute = createRoute({
  getParentRoute: () => mainRoute, // loginRoute는 rootRoute의 자식으로, Header나 Sidebar 없음
  path: 'order',
  component: OrderPage,
});

rootRoute.children = [mainRoute];
mainRoute.children = [homeRoute, orderRoute];

// Router 생성
export const router = createRouter({
  routeTree: rootRoute, // 루트 라우트 전달
});

// Router에 Devtools 연결 (개발 도구)
export const App = () => (
  <>
    <RouterProvider router={router} />
  </>
);
