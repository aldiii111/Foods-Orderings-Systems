import { getProductById } from "@/lib/api";

export const testData = async () => {
    try {
        const res = await getProductById(4)
        console.log("Berhasils", res.data)
    }
    catch (err) {
        console.log("Gagal", err)
    }
}

testData();