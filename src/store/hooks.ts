// import type { AppDispatch, RootState } from "./store";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./types";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
