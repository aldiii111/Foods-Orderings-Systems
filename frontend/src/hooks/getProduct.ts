import api from "@/lib/api";

export const testData = async () => {
    try {
        const res = await api.get('http://localhost:5432/food_ordering')
        console.log(res.data)
    }
    catch (err) {
        console.log("Gagal", err)
    }
}

testData();