import Dashboard from "../../components/Dashboard";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import EventCard from "../../components/EventCard";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function MyUpcomingRSVPs() {

  // Defining gql query which will fetch all of the rsvps for the users account: 
  const MY_UPCOMING_RSVPS = gql`
    query Account($id:String) {
      account(id: $id){
        id
        rsvps {
          event {
            id
            name
            eventTimestamp
            imageURL
          }
        }
      }
    }
  `;

  /**
   * To only show the rsvps for upcoming events, events returned from the query can be filtered
   * by the `eventTimestamp`. It also allows hte user to ocnnec ttheir wallet just as they did 
   * on the other pages w/ the `ConnectButton` & the `useAccount` hook. The users wallet address 
   * is stored in the `useAccount` hook & passed to the query. To make sure the subgraph is able to 
   * match the address corretly, the address will need to be transformed to lowercase. 
   */
  const {data: account} = useAccount(); 

  const id = account ? account.address.toLowerCase() : "";
  const [currentTimestamp, setEventTimestamp] = useState(new Date().getTime()); 
  const { loading, error, data } = useQuery(MY_UPCOMING_RSVPS, {
    variables: { id },
  }); 

  if(loading)
    return (
      <Dashboard page="rsvps" isUpcoming={true}>
        <p>Loading</p>
      </Dashboard>
    ); 

  if(error)
    return (
      <Dashboard page="rsvps" isUpcoming={true}>
        <p>`Error! ${error.message}`</p>
      </Dashboard>
    ); 

  return (
    <Dashboard page="rsvps" isUpcoming={true}>
      {account ? (
        <div>
          {data && !data.account && <p>No upcoming RSVPs found!</p>}
          {data && data.account && (
            <ul 
              role="list"
              className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
              >
              {data.account.rsvps.map(function (rsvp) {
                if(rsvp.event.Timestamp > currentTimestamp){
                  return (
                    <li key={rsvp.event.id}>
                      <EventCard
                        id={rsvp.event.id}
                        name={rsvp.event.name}
                        eventTimestamp={rsvp.event.eventTimestamp}
                        imageURL={rsvp.event.imageURL}
                        />
                    </li>
                  );
                }
              })}
              </ul>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center py-8">
          <p className="mb-4">Please connect your wallet to view your rsvps.</p>
          <ConnectButton className="button-85"/>
        </div>
      )}
    </Dashboard>
  );
}
