import axios from "axios";
import { getAuthHeader } from "./auth.api";

const BASE_URL = `http://localhost:5555/notification`;

// ----------------------
// 🩵 USER ACTIONS
// ----------------------

// ✅ Like bài viết
export const createLikeNotification = (postId) =>
  axios.post(`${BASE_URL}/like`, { postId }, getAuthHeader());

// ✅ Comment bài viết
export const createCommentNotification = (postId) =>
  axios.post(`${BASE_URL}/comment`, { postId }, getAuthHeader());

// ----------------------
// 🩶 ADMIN / MANAGER ACTIONS
// ----------------------

// ✅ Duyệt bài viết
export const createApprovePostNotification = (postId) =>
  axios.post(`${BASE_URL}/approve-post`, { postId }, getAuthHeader());

// ✅ Duyệt sự kiện
export const createApproveEventNotification = (eventId) =>
  axios.post(`${BASE_URL}/approve-event`, { eventId }, getAuthHeader());

// ✅ Duyệt người tham gia
export const createApproveUserNotification = (data) =>
  axios.post(`${BASE_URL}/approve-user`, data, getAuthHeader());

// ✅ Gửi thông báo khi có sự kiện mới cần duyệt
export const createEventNotification = (eventId) =>
  axios.post(`${BASE_URL}/new-event`, { eventId }, getAuthHeader());

// ✅ Gửi thông báo khi có bài viết mới cần duyệt
export const createPostNotification = (postId) =>
  axios.post(`${BASE_URL}/new-post`, { postId }, getAuthHeader());

export const createUserRegisterNotification = (eventId) =>
  axios.post(`${BASE_URL}/new-user-register`, { eventId }, getAuthHeader());

// ----------------------
// 🔔 GET / UPDATE / DELETE
// ----------------------

// ✅ Lấy danh sách thông báo của user
export const getNotificationsById = () =>
  axios.get(`${BASE_URL}/my`, getAuthHeader());

// ✅ Lấy danh sách thông báo cho admin
export const getNotificationsByIdAdmin = () =>
  axios.get(`${BASE_URL}/admin`, getAuthHeader());

// ✅ Đánh dấu đã đọc
export const markAsRead = (id) =>
  axios.put(`${BASE_URL}/${id}/read`, {}, getAuthHeader());

// ✅ Xóa thông báo
export const deleteNotification = (id) =>
  axios.delete(`${BASE_URL}/${id}`, getAuthHeader());
