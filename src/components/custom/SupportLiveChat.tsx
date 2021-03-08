import React, { useEffect, useRef } from 'react'

import Talk from "talkjs";

export interface SupportLiveChatProps {
    user: {
        stripeCustomerID: string,
        firstName: string,
        email: string,
    }
}

export interface SupportLiveChat extends React.FC<SupportLiveChatProps> {}

export const SupportLiveChat: SupportLiveChat = ( { user }) => {
    const talkJsContainer = useRef(null)
    
    useEffect(() => {
        Talk.ready.then(() => {
            const currentUser = new Talk.User({
                id: user.stripeCustomerID,
                name: user.firstName,
                email: user.email,
            });

            // @ts-ignore
            window.talkSession = new Talk.Session({
                appId: "t5Lhd9Vn",
                me: currentUser
            });
            

            const customerSupportUser = new Talk.User({
                id: "654321",
                name: "Sebastian",
                email: "Sebastian@example.com",
                photoUrl: "https://demo.talkjs.com/img/sebastian.jpg",
                welcomeMessage: "Hej! Brug for hjælp? Send os en besked her :-)"
            });

            // @ts-ignore
            const conversation = window.talkSession.getOrCreateConversation(Talk.oneOnOneId(currentUser, customerSupportUser))

            conversation.setParticipant(currentUser);
            conversation.setParticipant(customerSupportUser);

            // @ts-ignore
            const inbox = window.talkSession.createInbox({selected: conversation});

            inbox.mount(talkJsContainer.current)
        })
    }, [])
    
    return (
        <div className="fixed right-0 bottom-0 mb-4 mr-4" ref={talkJsContainer}>
            
        </div>
    )
}
