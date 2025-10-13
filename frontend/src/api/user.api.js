import axios from "axios";
import { getAuthHeader } from "./auth.api";

const BASE_URL = "http://localhost:5555/user";

export const getAllUser = () => {
    return axios.get(`${BASE_URL}/all`, getAuthHeader())
};

export const getProfileUser = () => {
    return axios.get(`${BASE_URL}/profile`, getAuthHeader())
};

export const deleteUser = (id) => {
    return axios.delete(`${BASE_URL}/delete/${id}`, getAuthHeader())
}

export const updateUser = (data) => {
    return axios.patch(`${BASE_URL}/update`, data, getAuthHeader())
}

export const adminUpdateUser = (id, data) => {
    return axios.patch(`${BASE_URL}/update/${id}`, data, getAuthHeader())
}

export const changePassword = (data) => {
    return axios.put(`${BASE_URL}/changePassword`, data, getAuthHeader())

}
