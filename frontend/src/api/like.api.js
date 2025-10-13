import axios from "axios";
import { getAuthHeader } from "./auth.api";

const BASE_URL = "http://localhost:5555/like";

export const LikeUnLike = (postId) => {
  return axios.post(`${BASE_URL}/LikeUnLike`, {postId} , getAuthHeader());
};

export const countLike = (postId) => {
  return axios.post(`${BASE_URL}/count`, {postId} , getAuthHeader());
};

export const getLikedPosts = () => {
  return axios.get(`${BASE_URL}/liked`, getAuthHeader());
};
