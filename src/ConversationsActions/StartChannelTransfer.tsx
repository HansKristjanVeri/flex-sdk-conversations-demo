import * as FlexSDK from "@twilio/flex-sdk";
import React, { useState } from "react";

interface Props { 
    client: FlexSDK.Client | undefined,
}

export function StartChannelTransfer({ client }: Props) {
    const [result, setResult] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const taskSid = String(formData.get("taskSid"));
        const from = String(formData.get("from"));
        const to = String(formData.get("to"));
        const options = formData.get("options") ? JSON.parse(String(formData.get("options"))) : undefined;

        if (!client) {
            console.error("Client not initialized");
            return;
        }
        
        try {
            const startChannelTransfer = new FlexSDK.StartChannelTransfer(taskSid, from, to, options);
            await client.execute(startChannelTransfer);
            setResult("Channel transfer started successfully");
        } catch (e) {
            console.error("Error starting channel transfer", e);
            setResult("Error starting channel transfer");
        }
    }

    return (
        <div style={{ border: "1px solid black", padding: "20px", width: "100%", maxWidth: "600px" }}>
            <h3> StartChannelTransfer </h3>
            <form method="post" onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <label>taskSid:</label>
                    <input name="taskSid" />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <label>from:</label>
                    <input name="from" />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <label>to:</label>
                    <input name="to" />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <label>options:</label>
                    <input name="options" />
                </div>
                <button type="submit">Start Channel Transfer</button>
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