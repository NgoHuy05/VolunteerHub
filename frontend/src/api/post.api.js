import axios from "axios";
import { getAuthHeader } from "./auth.api";

const BASE_URL = "http://localhost:5555/post";

export const getAllPost = () => {
    return axios.get(`${BASE_URL}/all`, getAuthHeader())
};
export const getAllPostApproved = () => {
    return axios.get(`${BASE_URL}/all/approved`, getAuthHeader())
};

export const getPostById = (id) => {
    return axios.get(`${BASE_URL}/${id}`, getAuthHeader())
};

export const getPostByIdEventApproved = (eventId) => {
    return axios.get(`${BASE_URL}/event/approved/${eventId}`, getAuthHeader())
};

export const getEventApprovedWithPostByIdEventPending = () => {
    return axios.get(`${BASE_URL}/event/post-pending`, getAuthHeader())
};

export const getPostByIdEvent = (eventId) => {
    return axios.get(`${BASE_URL}/event/${eventId}`, getAuthHeader())
};

export const getPostByIdUser = (userId) => {
    return axios.get(`${BASE_URL}/user/${userId}`, getAuthHeader())
};

export const createPost = (data) => {
  return axios.post(`${BASE_URL}/create`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...getAuthHeader().headers,
    },
  });
};

export const filterPost = (title) => {
    return axios.post(`${BASE_URL}/filter`, {title}, getAuthHeader())
};

export const deletePost = (id) => {
    return axios.delete(`${BASE_URL}/delete/${id}`, getAuthHeader())
}

export const updatePost = (id, data) => {
    return axios.patch(`${BASE_URL}/update/${id}`, data, getAuthHeader())
}
export const approvePost = (id, status) => {
    return axios.patch(`${BASE_URL}/approve/${id}`, {status}, getAuthHeader())

}
