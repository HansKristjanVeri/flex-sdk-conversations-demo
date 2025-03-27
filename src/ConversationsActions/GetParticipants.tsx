import * as FlexSDK from "@twilio/flex-sdk";
import React, { useState } from "react";

interface Props { 
    client: FlexSDK.Client | undefined,
}

export function GetParticipants({ client }: Props) {
    const [participants, setParticipants] = useState<FlexSDK.TaskParticipant[]>([]);
    const [error, setError] = useState<string | null>(null);

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
            const getParticipants = new FlexSDK.GetTaskParticipants(taskSid);
            const response = await client.execute(getParticipants);
            setParticipants(response);
            setError(null);
        } catch (e) {
            console.error("Error getting participants", e);
            setError("Error getting participants");
        }
    }

    return (
        <div style={{ border: "1px solid black", padding: "20px", width: "100%", maxWidth: "600px" }}>
            <h3> GetParticipants </h3>
            <form method="post" onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <label>taskSid:</label>
                    <input name="taskSid" />
                </div>
                <button type="submit">Get Participants</button>
            </form>
            {error && (
                <div>
                    <h3>Error:</h3>
                    <pre>{error}</pre>
                </div>
            )}
            {participants.length > 0 && (
                <div>
                    <h3>Participants:</h3>
                    <ul>
                        {participants.map(participant => (
                            <li key={participant.participantSid}>{[participant.participantSid," " ,participant.type]}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}