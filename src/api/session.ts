"use server"

import { getRequestEvent } from "solid-js/web"
import { EventHandlerRequest, H3Event, getCookie, unsealSession } from "vinxi/server"


const SESSION_SECRET = process.env.SESSION_SECRET ?? "areallylongsecretthatyoushouldreplace"

// This is a workaround, see https://github.com/solidjs/solid-start/issues/1192
export async function getSessionData<SessionDataT = Record<string, any>>() {
  const event = getRequestEvent()!
  const cookie = getCookie(event, "h3")!
  const { data } = await unsealSession(
    event as H3Event<EventHandlerRequest>,
    { password: SESSION_SECRET },
    cookie
  )
  return data! as SessionDataT
}
