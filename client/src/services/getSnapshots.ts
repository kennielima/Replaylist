"use server"
import { cookies } from "next/headers";

const getSnapshots = async (playlistId: string) => {
    const cookie = await cookies();
    const cookieHeader = cookie.toString();
    const token = cookie.get('token')?.value;

    const res = await fetch(`${process.env.API_URL}/api/snapshots/${playlistId}/getSnapshots`, {
        method: "GET",
        headers: {
            cookie: cookieHeader,
            'Authorization': `Bearer ${token}`,
            'Cookies': `token=${token}`
        },
        credentials: "include"
    });
    if (!res.ok) {
        return null;
    }

    const data = await res.json();
    return data;
}

const getSnapshotById = async (playlistId: string, snapshotId: string) => {
    const cookie = await cookies();
    const cookieHeader = cookie.toString();
    const token = cookie.get('token')?.value;

    const res = await fetch(`${process.env.API_URL}/api/snapshots/${playlistId}/getSnapshots/${snapshotId}`, {
        method: "GET",
        headers: {
            cookie: cookieHeader,
            'Authorization': `Bearer ${token}`,
            'Cookies': `token=${token}`
        },
        credentials: "include"
    });

    if (!res.ok) {
        return null;
    }

    const data = await res.json();
    return data;
}

export { getSnapshots, getSnapshotById };