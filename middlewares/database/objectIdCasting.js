import mongoose from "mongoose";

export const objectIdCasting = (id) => {
    const castingId = new mongoose.Types.ObjectId(id)
    return castingId;
}