import * as FlexSDK from "@twilio/flex-sdk";
import React, { useState } from "react";

interface Props { 
    client: FlexSDK.Client | undefined,
    setConversation: (conversation: FlexSDK.Conversation) => void;
}

export function StartOutBoundEmailTask({ client, setConversation }: Props) {
    const [result, setResult] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const to = String(formData.get("to"));  
        const from = String(formData.get("from"));
        const fromName = String(formData.get("fromName"));
        const taskQueueSid = String(formData.get("taskQueueSid"));
        const workflowSid = String(formData.get("workflowSid"));
        const attributesForTaskCreation = String(formData.get("attributesForTaskCreation"));

        if (!client) {
            console.error("Client not initialized");
            return;
        }
        
        try {
            const worker = await client.worker;
            const activityArray = Array.from(worker.activities.values());
            await activityArray[1].setAsCurrent();

            const options: FlexSDK.StartOutboundEmailTaskOptions = {
                from: from,
                fromName: fromName,
                taskQueueSid: taskQueueSid,
                workflowSid: workflowSid,
                attributesForTaskCreation: attributesForTaskCreation ? JSON.parse(attributesForTaskCreation) : undefined
            };

            const startOutBoundEmailTask = new FlexSDK.StartOutboundEmailTask(to, options);
            const {task, conversation} = await client.execute(startOutBoundEmailTask);
            setConversation(conversation);
            const result = {
                task: task.sid,
                conversation: conversation.sid
            };
            setResult(JSON.stringify(result, null, 2));
        } catch (e) {
            console.error("Error creating client", e);
        }
    }

    return (
        <div style={{ border: "1px solid black", padding: "20px", width: "100%", maxWidth: "600px" }}>
            <h3>StartOutBoundEmailTask</h3>
            <form method="post" onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>to:</label>
                <input name="to" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>from:</label>
                <input name="from" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>fromName:</label>
                <input name="fromName" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>taskQueueSid:</label>
                <input name="taskQueueSid" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>workflowSid:</label>
                <input name="workflowSid" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>attributesForTaskCreation:</label>
                <input name="attributesForTaskCreation" />
            </div>
            <button type="submit">Start OutBound Email Task</button>
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
