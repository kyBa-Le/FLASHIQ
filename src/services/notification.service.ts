/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { db, messaging } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { getToken, onMessage } from "firebase/messaging";
import type { Notification } from "@/types/notification.type";
import { ENV, NOTIFICATION_API } from "@/constants";
import apiClient from "./apiClient";

export const NotificationService = {
  subscribe: (
    userId: string,
    callback: (notifications: Notification[]) => void
  ) => {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const payload = doc.data();
        return {
          id: doc.id,
          ...payload,
          createdAt:
            payload.createdAt instanceof Timestamp
              ? payload.createdAt.toDate().toISOString()
              : new Date().toISOString(),
        };
      }) as Notification[];
      callback(data);
    });
  },

  registerFCM: async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      if ("serviceWorker" in navigator) {
        const params = new URLSearchParams({
          apiKey: ENV.API_KEY,
          authDomain: ENV.AUTH_DOMAIN,
          projectId: ENV.PROJECT_ID,
          storageBucket: ENV.STORAGE_BUCKET,
          messagingSenderId: ENV.MESSAGING_SENDER_ID,
          appId: ENV.APP_ID,
        }).toString();

        const registration = await navigator.serviceWorker.register(
          `/firebase-messaging-sw.js?${params}`
        );
        // console.log("✅ SW Registered with scope:", registration.scope);

        await navigator.serviceWorker.ready;

        const currentToken = await getToken(messaging, {
          vapidKey: ENV.VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (currentToken) {
          // console.log("🚀 Device FCM Token:", currentToken);
          await apiClient.post(NOTIFICATION_API.POST_FCM_TOKEN, {
            fcmToken: currentToken,
          });
          console.log("🚀 Token synced to server");
        }
      }
    } catch (error) {
      console.error("❌ FCM Registration failed:", error);
    }
  },

  fetchAllNotifications: async () => {
    const response = await apiClient.get(NOTIFICATION_API.GET_ALL);
    return response.data.notifications || [];
  },

  listenForegroundMessages: (onMessageReceived?: (payload: any) => void) => {
    return onMessage(messaging, (payload) => {
      console.log("📩 Receive notification Foreground:", payload);
      if (onMessageReceived) {
        onMessageReceived(payload);
      }
    });
  },
  markAsRead: async (notificationId: string) => {
    try {
      const response = await apiClient.post(
        NOTIFICATION_API.MARK_AS_READ(notificationId)
      );

      return response.data;
    } catch (error) {
      console.error("met error when mark as read:", error);
      throw error;
    }
  },
};
