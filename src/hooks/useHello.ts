import { useEffect } from "react";
import { getHello } from "../services/hello.service";

export default function useHello() {
  useEffect(() => {
    getHello().then(res => console.log(res.message));
  }, []);
}
