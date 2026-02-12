"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

type Bookmark = {
    id: string
    title: string
    url: string
}

export default function Dashboard() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [title, setTitle] = useState("")
    const [url, setUrl] = useState("")
    const [userEmail, setUserEmail] = useState<any>(null)
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        async function init() {
            const { data } = await supabase.auth.getUser()
            const id = data.user?.id ?? null
            const email = data.user?.email ?? null

            setUserId(id)
            setUserEmail(email)

            if (id) {
                const { data: bookmarksData } = await supabase
                    .from("bookmarks")
                    .select("*")
                    .eq("user_id", id)
                    .order("created_at", { ascending: false })
                setBookmarks(bookmarksData || [])
            }
        }

        init()
    }, []) 

    //Fetch bookmarks 
    async function fetchBookmarks() {
        if (!userId) return 

        const { data } = await supabase
            .from("bookmarks")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })

        setBookmarks(data || [])
    }

    //Create bookmark
    async function addBookmark() {
        if (!title || !url) return

        await supabase.from("bookmarks").insert({
            title,
            url,
            user_id: userId,
        })

        setTitle("")
        setUrl("")
        fetchBookmarks()
    }

    //delete bookmark
    async function deleteBookmark(id: string) {
        await supabase.from("bookmarks").delete().eq("id", id)
        fetchBookmarks()
    }

    useEffect(() => {
        if (!userId) return 

        fetchBookmarks()

        const channel = supabase
            .channel("realtime-bookmarks")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bookmarks",
                },
                () => {
                    fetchBookmarks()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId]) 

    return (
        <div className="container">
            <h4>Welcome !</h4>
            <h5>{userEmail}</h5>

            <h1>Your Bookmarks</h1>

            <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <h5>Make sure URL starts with 'https....'</h5>
            <input
                placeholder="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />

            <button onClick={addBookmark}>Add Bookmark</button>

            <div style={{ marginTop: "20px" }}>
                {bookmarks.map((b) => (
                    <div key={b.id} className="bookmark">
                        <a href={b.url} target="_blank">
                            {b.title}
                        </a>
                        <button
                            className="delete"
                            onClick={() => deleteBookmark(b.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
