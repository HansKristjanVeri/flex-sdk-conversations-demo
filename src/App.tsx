import {CreateTwilioClient} from './createClient'
import './App.css'
import {Client, Conversation, GetTaskParticipants} from '@twilio/flex-sdk';
import { useState } from 'react';
import { StartOutBoundEmailTask } from './EmailActions/StartOutBoundEmailTask';
import { AddEmailParticipant } from './EmailActions/AddEmailParticipant';
import { RemoveEmailParticipant } from './EmailActions/RemoveEmailParticipant';
import { ConversationActions } from './ConversationsActions/Conversation';
import { PauseConversationChannel } from './ConversationsActions/PauseConversationChannel';
import { StartChannelTransfer } from './ConversationsActions/StartChannelTransfer';
import { LeaveConversationChannel } from './ConversationsActions/LeaveConversationChannel';
import { GetConversationByTask } from './ConversationsActions/GetConversationByTask';
import { AddConversationEventListener } from './ConversationsActions/AddConversationEventListener';
import { GetConversationsUser } from './ConversationsActions/GetConversationsUser';
import { GetParticipants } from './ConversationsActions/GetParticipants';

function App() {
   const [client, setClient]  = useState<Client>();
   const [conversation, setConversation] = useState<Conversation>();
  return (
    <>
     <div  style={{ padding: "10px 0" }}>
      <h1>Flex-SDK Messaging Actions</h1>
      <CreateTwilioClient setAppClient={setClient}/>
    </div>

    <div style={{ padding: "10px 0" }}>
      <AddConversationEventListener client={client} setConversation={setConversation}/>
    </div>

    <div style={{ padding: "10px 0" }}>
      <ConversationActions conversation={conversation}/>
    </div>

    <div style={{ padding: "10px 0" }}>
      <StartOutBoundEmailTask client={client} setConversation={setConversation}/>
    </div>
    <div style={{ padding: "10px 0" }}>
      <AddEmailParticipant client={client}/>
    </div>

    <div style={{ padding: "10px 0" }}>
      <RemoveEmailParticipant client={client}/>
    </div>

    <div style={{ padding: "10px 0" }}>
      <PauseConversationChannel client={client}/>
    </div>

    <div style={{ padding: "10px 0" }}>
      <StartChannelTransfer client={client}/>
    </div>

    <div style={{ padding: "10px 0" }} >
      <LeaveConversationChannel client={client}/>
    </div>

    <div style={{ padding: "10px 0" }}>
      <GetConversationByTask client={client}/>
    </div>

    <div style={{ padding: "10px 0" }}>
      <GetConversationsUser client={client}/>
    </div>

    <div style={{ padding: "10px 0" }}>
      <GetParticipants client={client}/>
    </div>

    </>
  )
}

export default App
