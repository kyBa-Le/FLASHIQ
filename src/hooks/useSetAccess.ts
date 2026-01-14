import { useEffect, useState } from "react";
import { accessService } from "@/services/access.service";
import type { AccessUser } from "@/services/access.service";

export function useSetAccess(setId?: string) {
  const [accessList, setAccessList] = useState<AccessUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!setId) return;

    let cancelled = false;

    accessService
      .getSetAccess(setId)
      .then((res) => {
        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data?.items)
          ? res.data.items
          : [];

        if (!cancelled) {
          setAccessList(list);
        }
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [setId]);

  const invite = async (email: string, permission: "VIEW" | "EDIT") => {
    if (!setId) throw new Error("Missing setId");

    setLoading(true);
    try {
      await accessService.inviteUser({ setId, email, permission });

      const res = await accessService.getSetAccess(setId);

      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data?.items)
        ? res.data.items
        : [];

      setAccessList(list);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (accessId: string) => {
    setAccessList((prev) => prev.filter((i) => i.id !== accessId));
    await accessService.removeAccess(accessId);
  };

  return {
    accessList,
    loading,
    invite,
    remove,
  };
}
