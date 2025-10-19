import axios from "axios";
import { getAuthHeader } from "./auth.api";
const BASE_URL = "http://localhost:5555/event";

export const getAllEvent = () => {
    return axios.get(`${BASE_URL}/all`, getAuthHeader());
};
export const getApprovedEventsUserNotJoined = () => {
    return axios.get(`${BASE_URL}/available`, getAuthHeader());
};

export const getAllEventApprovedByUserId = () => {
    return axios.get(`${BASE_URL}/all/approved`, getAuthHeader());
};

export const getAllEventRejectedByUserId = () => {
    return axios.get(`${BASE_URL}/all/rejected`, getAuthHeader());
};

export const getAllEventCompletedByUserId = () => {
    return axios.get(`${BASE_URL}/all/completed`, getAuthHeader());
};

export const getAllEventPendingByUserId = () => {
    return axios.get(`${BASE_URL}/all/pending`, getAuthHeader());
};

export const getAllEventCreatedBy = () => {
    return axios.get(`${BASE_URL}/all/createdBy`, getAuthHeader());
};  

export const getAllEventCreatedByAndStatus = (status) => {
    return axios.get(`${BASE_URL}/all/createdByAndStatus`, {
        params: {status},
        ...getAuthHeader(),
    });
};  


export const getEventById = (id) => {
    return axios.get(`${BASE_URL}/${id}`, getAuthHeader());
}

export const createEvent = (data) => {
  return axios.post(`${BASE_URL}/create`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...getAuthHeader().headers, 
    },
  });
};


export const deleteEvent = (id) => {
    return axios.delete(`${BASE_URL}/delete/${id}`, getAuthHeader());
}
export const updateEvent = (id, data) => {
    return axios.patch(`${BASE_URL}/update/${id}`, data, getAuthHeader());
}
export const approveEvent = (id, status) => {
    return axios.patch(`${BASE_URL}/approve/${id}`, {status}, getAuthHeader());
}

