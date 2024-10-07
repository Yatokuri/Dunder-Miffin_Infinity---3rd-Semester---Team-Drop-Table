import { atom } from "jotai";

// Define different order statuses remember update backend validator too
export const productFilterAtom = atom([
    "Normal",
    "Ascending",
    "Descending",
]);
