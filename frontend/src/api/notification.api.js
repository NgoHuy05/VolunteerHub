import axios from "axios";
import { getAuthHeader } from "./auth.api";

const BASE_URL = `${import.meta.env.VITE_API_URL}/notification`;

export const createLikeNotification = (postId) =>
  axios.post(`${BASE_URL}/like`, { postId }, getAuthHeader());

export const createCommentNotification = (postId) =>
  axios.post(`${BASE_URL}/comment`, { postId }, getAuthHeader());

export const createApprovePostNotification = (postId) =>
  axios.post(`${BASE_URL}/approve-post`, { postId }, getAuthHeader());

export const createApproveEventNotification = (eventId) =>
  axios.post(`${BASE_URL}/approve-event`, { eventId }, getAuthHeader());

export const createApproveUserNotification = (data) =>
  axios.post(`${BASE_URL}/approve-user`, data, getAuthHeader());

export const createEventNotification = (eventId) =>
  axios.post(`${BASE_URL}/new-event`, { eventId }, getAuthHeader());

export const createPostNotification = (postId) =>
  axios.post(`${BASE_URL}/new-post`, { postId }, getAuthHeader());

export const createUserRegisterNotification = (eventId) =>
  axios.post(`${BASE_URL}/new-user-register`, { eventId }, getAuthHeader());

export const getNotificationsById = () =>
  axios.get(`${BASE_URL}/my`, getAuthHeader());

export const getNotificationsByIdAdmin = () =>
  axios.get(`${BASE_URL}/admin`, getAuthHeader());

export const markAsRead = (id) =>
  axios.put(`${BASE_URL}/${id}/read`, {}, getAuthHeader());

export const deleteNotification = (id) =>
  axios.delete(`${BASE_URL}/${id}`, getAuthHeader());
