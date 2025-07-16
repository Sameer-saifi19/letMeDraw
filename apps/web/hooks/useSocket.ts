import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
    const [ loading, setLoading ] = useState(true);
    const [ socket, setSocket ] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjOGVjYjFlNC0yNGU5LTQ1OWEtYWU5OS1jYmUwNDQyMjE5YzQiLCJpYXQiOjE3NTIzOTYyNjF9.jASWv3_zunWJ-0yIxatzWJxZ271zO4nJpLVmm4wvpXo`);
        ws.onopen = () =>{
            setLoading(false)
            setSocket(ws)
        }
    }, [])

    return{
        socket, loading
    }
    
}
