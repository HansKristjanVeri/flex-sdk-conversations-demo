import React, { useState } from "react";
import * as FlexSDK from "@twilio/flex-sdk";
import {Worker} from "@twilio/flex-sdk/taskrouter";

interface Props { 
    setAppClient: (client: FlexSDK.Client) => void;
    client : FlexSDK.Client | undefined;
}

export function CreateTwilioClient({ setAppClient, client }: Props) {
    const [worker, setWorker] = useState<  Worker| null>(null);
    const [message, setMessage] = useState<string | null>(null);


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const token = String(formData.get("token"));
        console.log("token", token);

        try {
            const client1 = await FlexSDK.createClient(token);
            const workerInstance = await client1.worker;
            await new Promise<void>(resolve => {
                workerInstance.on("ready", () => {
                    resolve();
                });
            });
            setWorker(workerInstance);
            setAppClient(client1);
            setMessage("Client created successfully!");
            console.log("Here's the client", client1);
        } catch (e) {
            console.error("Error creating client", e);
            setMessage("Error creating client: " + (e instanceof Error ? e.message : "Unknown error"));
        }
    }

    async function handleAcceptTask() {
        const reservationsArray: FlexSDK.Reservation[] = Array.from(worker.reservations.values());
        console.log(Array.from(worker.reservations.values()));
        const reservation = reservationsArray[0];
        await client?.execute(new FlexSDK.AcceptTask(reservation.task.sid));
        setMessage(`Task ${reservation.task.sid} accepted`);

    }

    return (
        <div style={{ border: "1px solid black", padding: "20px", width: "100%", maxWidth: "600px" }}>
            <form style={{ display: "flex", flexDirection: "column" }} method="post" onSubmit={handleSubmit}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <label>token:</label>
                    <input name="token" />
                </div>
                <button type="submit" style={{ marginTop: "10px" }}>createClient</button>
            </form>
            <button 
                onClick={handleAcceptTask} 
                style={{ 
                    width: "100%", 
                    marginTop: "10px",
                    padding: "8px 0",
                    marginBottom: "10px" 
                }}  
            >
                Accept Task
            </button>
            {message && <div style={{ marginTop: "10px", color: message.startsWith("Error") ? "red" : "green" }}>{message}</div>}
        </div>
    );
}
