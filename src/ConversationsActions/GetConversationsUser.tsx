import * as FlexSDK from "@twilio/flex-sdk";
import React, { useState } from "react";

interface Props { 
    client: FlexSDK.Client | undefined,
}

export function GetConversationsUser({ client }: Props) {
    const [result, setResult] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const userSid = String(formData.get("userSid"));

        if (!client) {
            console.error("Client not initialized");
            return;
        }
        
        try {
            const getConversationsUser = new FlexSDK.GetConversationsUser(userSid);
            const conversations = await client.execute(getConversationsUser);
            setResult(JSON.stringify(conversations, null, 2));
        } catch (e) {
            console.error("Error getting conversations for user", e);
            setResult("Error getting conversations for user");
        }
    }

    return (
        <div style={{ border: "1px solid black", padding: "20px", width: "100%", maxWidth: "600px" }}>
            <h3> GetConversationsUser </h3>
            <form method="post" onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <label>userSid:</label>
                    <input name="userSid" />
                </div>
                <button type="submit">Get Conversations for User</button>
            </form>
            {result && (
                <div>
                    <h3>Result:</h3>
                    <pre>{result}</pre>
                </div>
            )}
        </div>
    );
}