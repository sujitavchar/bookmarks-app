"use client"

import { supabase } from "../lib/supabase"

export default function LoginButton() {
  async function login() {
    await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: "http://localhost:3000/dashboard",
        },
    })

  }

  return <button onClick={login}>Login with Google</button>
}
