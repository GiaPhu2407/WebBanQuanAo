// lib/pusher.ts
import PusherServer from "pusher";
import PusherClient from "pusher-js";

const hasServerConfig =
  Boolean(process.env.PUSHER_APP_ID) &&
  Boolean(process.env.NEXT_PUBLIC_PUSHER_APP_KEY) &&
  Boolean(process.env.PUSHER_APP_SECRET);

export const pusherServer: PusherServer = hasServerConfig
  ? new PusherServer({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
      secret: process.env.PUSHER_APP_SECRET!,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap1",
      useTLS: true,
    })
  : ({
      trigger: async () => {},
    } as unknown as PusherServer);

const hasClientKey = Boolean(process.env.NEXT_PUBLIC_PUSHER_APP_KEY);

export const pusherClient: PusherClient = hasClientKey
  ? new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap1",
    })
  : ({
      subscribe: () => ({
        bind: () => {},
        unbind: () => {},
      }),
      unsubscribe: () => {},
    } as unknown as PusherClient);
