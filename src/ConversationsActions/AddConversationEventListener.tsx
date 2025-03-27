import * as FlexSDK from "@twilio/flex-sdk";
import React, { useState } from "react";

interface Props { 
    client: FlexSDK.Client | undefined,
    setConversation: (conversation: FlexSDK.Conversation) => void;
}

export function AddConversationEventListener({ client, setConversation }: Props) {
    const [result, setResult] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const event = String(formData.get("event"));
        const handlerCode = String(formData.get("handler"));

        if (!client) {
            console.error("Client not initialized");
            return;
        }

        try {
            if (handlerCode.length === 0) {
                const addConversationEventListener = new FlexSDK.AddConversationEventListener(event as FlexSDK.ConversationClientEvent, (...args: unknown[]) => {
                    const conversation = args[0] as FlexSDK.Conversation;
                    setConversation(conversation);
                });
                await client.execute(addConversationEventListener);
                setResult("Conversation event listener added successfully");
            }
            else {
                const handler = eval(`(${handlerCode})`);
                const addConversationEventListener = new FlexSDK.AddConversationEventListener(event as FlexSDK.ConversationClientEvent, handler);
                await client.execute(addConversationEventListener);
                setResult("Conversation event listener added successfully");
            }   
            
            
        } catch (e) {
            console.error("Error adding conversation event listener", e);
            setResult("Error adding conversation event listener");
        }
    }

    return (
        <div style={{ border: "1px solid black", padding: "20px", width: "100%", maxWidth: "600px" }}>

            <form method="post" onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <label>Event:</label>
                    <input name="event" />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <label>Handler:</label>
                    <textarea name="handler" rows={5} />
                </div>
                <button type="submit">Add Conversation Event Listener</button>
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