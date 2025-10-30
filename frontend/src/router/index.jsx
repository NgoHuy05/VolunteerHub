import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";

import Layout from "../layout/Layout";
import EventList from "../pages/Event/EventList";
import EvenDetail from "../pages/Event/EventDetail";
import EventJoining from "../pages/Event/EventJoining";
import EventPendingJoin from "../pages/Event/EventPendingJoin";
import EventCompleted from "../pages/Event/EventCompleted";
import EventYour from "../pages/Event/EventYour";
import EventRejected from "../pages/Event/EventRejected";
import EventLayout from "../layout/EventLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Profile from "../pages/Profile";
import ManageLayout from "../layout/ManageLayout";
import ManageYourEvent from "../pages/Manager/ManageYourEvent";
import ManagePost from "../pages/Manager/ManagePost";
import ManageApproved from "../pages/Manager/ManageApproved";
import ManagePending from "../pages/Manager/ManagePending";
import ManageRejected from "../pages/Manager/ManageRejected";
import ManageCompleted from "../pages/Manager/ManageCompleted";
import ManageUser from "../pages/Manager/ManageUser";
import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminListEvent from "../pages/Admin/AdminListEvent";
import AdminListUser from "../pages/Admin/AdminListUser";
import AdminListPost from "../pages/Admin/AdminListPost";
import ManageCreateEvent from "../pages/Manager/ManageCreateEvent";

export const routers = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "event",
    element: <EventLayout />,
    children: [
      {
        path: "home",
        element: <EventList />,
      },
      {
        path: "detail/:id",
        element: <EvenDetail />,
      },
      {
        path: "joining",
        element: <EventJoining />,
      },
      {
        path: "pending-join",
        element: <EventPendingJoin />,
      },
      {
        path: "rejected",
        element: <EventRejected />,
      },
      {
        path: "completed",
        element: <EventCompleted />,
      },
      {
        path: "your-event",
        element: <EventYour />,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
  {
    path: "manage",
    element: <ManageLayout />,
    children: [
      {
        path: "create",
        element: <ManageCreateEvent />,
      },
      {
        path: "your-event",
        element: <ManageYourEvent />,
      },
      {
        path: "post",
        element: <ManagePost />,
      },
      {
        path: "user",
        element: <ManageUser />,
      },
      {
        path: "approved",
        element: <ManageApproved />,
      },
      {
        path: "pending",
        element: <ManagePending />,
      },
      {
        path: "rejected",
        element: <ManageRejected />,
      },
      {
        path: "completed",
        element: <ManageCompleted />,
      },
    ],
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "list/posts",
        element: <AdminListPost />,
      },
      {
        path: "list/events",
        element: <AdminListEvent />,
      },
      {
        path: "list/users",
        element: <AdminListUser />,
      }
    ],
  },
]);
