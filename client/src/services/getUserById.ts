"use server"

const fetchUserById = async (id: string) => {
    const res = await fetch(`${process.env.API_URL}/api/users/${id}`, {
        method: "GET",
    });

    if (!res.ok) {
        return null;
    }

    const data = await res.json();
    return data;
}

export default fetchUserById;
