import * as FlexSDK from "@twilio/flex-sdk";
import { SendEmailMessageOptions } from "@twilio/flex-sdk";
import React, { useState, useEffect } from "react";

interface Props { 
    conversation: FlexSDK.Conversation | undefined,
}

interface Message {
    id: string;
    body: string;
    author: string;
    timestamp: Date;
}

export function ConversationActions({ conversation }: Props) {
    const [result, setResult] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageBody, setMessageBody] = useState<string>("");

    useEffect(() => {
        if (!conversation) {
            return;
        }

        const fetchMessages = async () => {
            const paginator = await conversation.getMessages();
            console.log(paginator.items);
            const formattedMessages = paginator.items.map((msg: any) => ({
            id: msg.sid,
            body: msg.body,
            author: msg.author,
            timestamp: new Date(msg.dateCreated)
            }));
            setMessages(formattedMessages);
        };

        fetchMessages();

        const handleMessageAdded = (message: any) => {
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    id: message.sid,
                    body: message.body,
                    author: message.author,
                    timestamp: new Date(message.dateCreated)
                }
            ]);
        };

        conversation.conversation.on("messageAdded", handleMessageAdded);

        return () => {
            conversation.conversation.off("messageAdded", handleMessageAdded);
        };
    }, [conversation]);

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!conversation) {
            console.error("Conversation not initialized");
            return;
        }

        const messageOptions: SendEmailMessageOptions = {
            messageAttributes: {},
            subject: "Test Subject",
            attachedFiles: [],
            htmlBody: messageBody,
            plainTextBody: messageBody
        };

        try {
            const messageId = await conversation.sendMessage(messageOptions);
            setResult(`Message sent successfully with ID: ${messageId}`);
            setMessageBody("");
        } catch (e) {
            console.error("Error sending message", e);
            setResult("Error sending message");
        }
    };

    const handleKeyPress = () => {
        if (conversation) {
            conversation.sendTyping();
        }
    };

    return (
        <><div style={{ border: "1px solid black", padding: "20px", width: "100%", maxWidth: "600px" }}><h3>Active Conversation</h3>
        <div style={{ marginTop: "20px", border: "1px solid gray", padding: "10px", maxHeight: "300px", overflowY: "scroll" }}>
            {messages.map(message => (  
                <div key={message.id} style={{ marginBottom: "10px", padding: "10px", borderRadius: "5px", backgroundColor: "#ADD8E6", boxShadow: "0 2px 4px rgba(162, 59, 59, 0.1)", maxWidth: "600px", wordWrap: "break-word" }}>
                    <div><strong>{message.author}</strong> <em>{message.timestamp.getHours().toString().padStart(2, '0')}:{message.timestamp.getMinutes().toString().padStart(2, '0')}</em></div>
                    <div>{message.body}</div>
                </div>
            ))}
        </div><form method="post" onSubmit={handleSendMessage} style={{ display: "grid", gap: "10px" }}>
                <textarea
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{ width: "100%", marginTop: "10px" }}
                    placeholder="Type a message..." />
                <button type="submit" style={{ marginTop: "10px", width: "100%" }}>Send Message</button>
            </form>
            </div>
            </>
    );
}
