import * as FlexSDK from "@twilio/flex-sdk";
import React, { useState } from "react";

interface Props { 
    client: FlexSDK.Client | undefined,
}

export function PauseConversationChannel({ client }: Props) {
    const [result, setResult] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const taskSid = String(formData.get("taskSid"));

        if (!client) {
            console.error("Client not initialized");
            return;
        }
        
        try {
            const pauseConversationChannel = new FlexSDK.PauseConversationChannel(taskSid);
            await client.execute(pauseConversationChannel);
            setResult("Conversation channel paused successfully");
        } catch (e) {
            console.error("Error pausing conversation channel", e);
        }
    }

    return (
        <div style={{ border: "1px solid black", padding: "20px", width: "100%", maxWidth: "600px" }}>
            <h3>PauseConversationChannel </h3>
            <form method="post" onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>taskSid:</label>
                <input name="taskSid" />
            </div>
            <button type="submit">Pause Conversation Channel</button>
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
