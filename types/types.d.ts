import { Client } from "discord-rpc"

export type ConfigData = {
  discord: boolean;
}

// declare module NodeJS {
//   interface Global {
//     rpc: Client;
//   }
// }

declare global {
  namespace NodeJS {
    interface Global {
      rpc?: Client;
    }
  }
}