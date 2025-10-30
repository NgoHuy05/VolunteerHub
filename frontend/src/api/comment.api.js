import axios from "axios";
import { getAuthHeader } from "./auth.api";
const BASE_URL = `${import.meta.env.VITE_API_URL}/comment`;


export const createComment = (data) => {
    return axios.post(`${BASE_URL}/create`, data, getAuthHeader());
}

export const getCommentByPostId = (postId) => {
    return axios.get(`${BASE_URL}/${postId}`, getAuthHeader());
}