import * as FlexSDK from "@twilio/flex-sdk";
import React, { useState } from "react";

interface Props { 
    client: FlexSDK.Client | undefined,
}

export function AddEmailParticipant({ client }: Props) {
    const [result, setResult] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const taskSid = String(formData.get("taskSid"));
        const email = String(formData.get("email"));
        const level = String(formData.get("level")) as FlexSDK.ParticipantLevel;
        const options = String(formData.get("options"));

        if (!client) {
            console.error("Client not initialized");
            return;
        }
        
        try {
            const addEmailParticipantOptions: FlexSDK.AddEmailParticipantOptions = options ? JSON.parse(options) : undefined;
            const addEmailParticipant = new FlexSDK.AddEmailParticipant(taskSid, email, level, addEmailParticipantOptions);
            await client.execute(addEmailParticipant);
            setResult("Participant added successfully");
        } catch (e) {
            console.error("Error adding email participant", e);
        }
    }

    return (
        <div style={{ border: "1px solid black", padding: "20px", width: "100%", maxWidth: "600px" }}>
            <form method="post" onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
            <h3>AddEmailParticipant</h3>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>taskSid:</label>
                <input name="taskSid" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>email:</label>
                <input name="email" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>level:</label>
                <input name="level" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>options:</label>
                <input name="options" />
            </div>
            <button type="submit">Add Email Participant</button>
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
