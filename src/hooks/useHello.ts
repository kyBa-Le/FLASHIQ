import { useEffect } from "react";
import { getHello } from "../services/set.service";

export default function useHello() {
  useEffect(() => {
    getHello().then(res => console.log(res.message));
  }, []);
}
