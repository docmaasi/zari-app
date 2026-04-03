/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as memories from "../memories.js";
import type * as messages from "../messages.js";
import type * as moodHistory from "../moodHistory.js";
import type * as pushSubscriptions from "../pushSubscriptions.js";
import type * as referrals from "../referrals.js";
import type * as reminders from "../reminders.js";
import type * as streaks from "../streaks.js";
import type * as subscriptions from "../subscriptions.js";
import type * as users from "../users.js";
import type * as voiceNotes from "../voiceNotes.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  memories: typeof memories;
  messages: typeof messages;
  moodHistory: typeof moodHistory;
  pushSubscriptions: typeof pushSubscriptions;
  referrals: typeof referrals;
  reminders: typeof reminders;
  streaks: typeof streaks;
  subscriptions: typeof subscriptions;
  users: typeof users;
  voiceNotes: typeof voiceNotes;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
