"use server"

import { getRequestEvent } from "solid-js/web"
import { EventHandlerRequest, H3Event, getCookie, unsealSession } from "vinxi/server"


const SESSION_SECRET = process.env.SESSION_SECRET ?? "areallylongsecretthatyoushouldreplace"

type SessionDataT = Record<string, any>;
// This is a workaround, see https://github.com/solidjs/solid-start/issues/1192
export async function getSessionData<Data extends SessionDataT = SessionDataT>(): Promise<Data> {
  try {
    const event = getRequestEvent()
    if (!event) throw new Error("Shouldn't happen, missing request event")

    const cookie = getCookie(event, "h3")
    if (!cookie) throw new Error("Missing cookie")

    const { data } = await unsealSession(
      event as H3Event<EventHandlerRequest>,
      { password: SESSION_SECRET },
      cookie
    )
    if (data) 
      return data as unknown as Data
  } catch (error) {
    console.error(error)
  }
  return {} as unknown as Data
}
