const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const API_URL = BACKEND_URL + '/api/v1';
export const SIGNIN_URL = API_URL + '/signin';
export const UPDATE_USERNAME_URL = API_URL + '/update-username';
export const GET_USERNAME_URL = API_URL + '/get-username';
export const CREATE_ROOM_URL = API_URL + '/room/create-room';
export const GET_ROOM_URL = API_URL + '/rooms/list-rooms/:id';
export const JOIN_ROOM_URL = API_URL + '/room/join-room';
export const GET_ROOM_CHECK_URL = API_URL + '/room/get-room-check';
export const DELETE_ROOM_URL = API_URL + '/room/delete-room';
export const LEAVE_ROOM_URL = API_URL + '/room/leave-room';