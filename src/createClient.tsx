import React, { useState, useEffect } from "react";
import * as FlexSDK from "@twilio/flex-sdk";

interface Props { 
    setAppClient: (client: FlexSDK.Client) => void;
}

export function CreateTwilioClient({ setAppClient }: Props) {
    const [isAutoAcceptEnabled, setIsAutoAcceptEnabled] = useState(false);
    const [worker, setWorker] = useState<FlexSDK.Worker | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const token = String(formData.get("token"));
        console.log("token", token);

        try {
            const client1 = await FlexSDK.createClient(token);
            const workerInstance = await client1.worker;

            setWorker(workerInstance);
            setAppClient(client1);
            console.log("Here's the client", client1);
        } catch (e) {
            console.error("Error creating client", e);
        }
    }

    function handleReservationCreated(reservation: { task?: { sid?: string } }) {
        console.log("Reservation created:", reservation);
        if (reservation.task?.sid) {
            console.log("Accepted Task with Sid", reservation.task.sid);
        }
    }

    useEffect(() => {
        if (worker) {
            if (isAutoAcceptEnabled) {
                worker.on("reservationCreated", handleReservationCreated);
            } else {
                worker.off("reservationCreated", handleReservationCreated);
            }
        }

        // Cleanup function to remove the listener when the component unmounts or `worker` changes
        return () => {
            if (worker) {
                worker.off("reservationCreated", handleReservationCreated);
            }
        };
    }, [isAutoAcceptEnabled, worker]);

    return (
        <div style={{ border: "1px solid black", padding: "20px", width: "100%", maxWidth: "600px" }}>
            <form style={{ display: "flex", flexDirection: "column" }} method="post" onSubmit={handleSubmit}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <label>token:</label>
                    <input name="token" />
                </div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                    <label style={{ marginRight: "10px" }}>Auto Accept Reservations:</label>
                    <input
                        type="checkbox"
                        checked={isAutoAcceptEnabled}
                        onChange={(e) => setIsAutoAcceptEnabled(e.target.checked)}
                    />
                </div>
                <button type="submit" style={{ marginTop: "10px" }}>createClient</button>
            </form>
        </div>
    );
}
