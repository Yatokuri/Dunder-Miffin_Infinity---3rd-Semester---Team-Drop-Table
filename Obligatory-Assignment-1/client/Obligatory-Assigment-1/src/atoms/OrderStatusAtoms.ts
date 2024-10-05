import { atom } from "jotai";

// Define different order statuses remember update backend validator too
export const orderStatusAtom = atom([
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Returned"
]);
