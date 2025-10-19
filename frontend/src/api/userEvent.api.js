import axios from "axios"
import { getAuthHeader } from "./auth.api";
const BASE_URL = "http://localhost:5555/userEvent";


export const approveUserJoinEvent = (id, status) => {
    return axios.post(`${BASE_URL}/approve/${id}`, { status }, getAuthHeader());
}
export const createUserEvent = (data) => {
    return axios.post(`${BASE_URL}/create`, data, getAuthHeader());
}
export const countAllUserByEventId = (id) => {
    return axios.get(`${BASE_URL}/all/${id}`, getAuthHeader());
}

export const countPendingUserByEventId = (id) => {
    return axios.get(`${BASE_URL}/pending/${id}`, getAuthHeader());
}

export const countJoiningUserByEventId = (id) => {
    return axios.get(`${BASE_URL}/joining/${id}`, getAuthHeader());
}

export const getUserEvent = () => {
    return axios.get(`${BASE_URL}/all`, getAuthHeader());
}

export const getEventByUserId = () => {
    return axios.get(`${BASE_URL}/events`, getAuthHeader());
}
export const getPendingUsersWithApprovedEvents = () => {
    return axios.get(`${BASE_URL}/pending-user`, getAuthHeader());
}

export const getEventByUserIdAndStatus = (status) => {
    return axios.get(`${BASE_URL}/events-status`, {
        params: { status },
        ...getAuthHeader(),
    });
};

