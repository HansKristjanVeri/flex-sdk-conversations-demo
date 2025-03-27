import * as FlexSDK from "@twilio/flex-sdk";
import React, { useState } from "react";

interface Props { 
    client: FlexSDK.Client | undefined,
}

export function RemoveEmailParticipant({ client }: Props) {
    const [result, setResult] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const taskSid = String(formData.get("taskSid"));
        const participantSid = String(formData.get("participantSid"));

        if (!client) {
            console.error("Client not initialized");
            return;
        }
        
        try {
            const removeEmailParticipant = new FlexSDK.RemoveEmailParticipant(taskSid, participantSid);
            await client.execute(removeEmailParticipant);
            setResult("Participant removed successfully");
        } catch (e) {
            console.error("Error removing email participant", e);
        }
    }

    return (
        <div style={{ border: "1px solid black", padding: "20px", width: "100%", maxWidth: "600px" }}>
            <h3>RemoveEmailParticipant </h3>
            <form method="post" onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>taskSid:</label>
                <input name="taskSid" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>participantSid:</label>
                <input name="participantSid" />
            </div>
            <button type="submit">Remove Email Participant</button>
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
