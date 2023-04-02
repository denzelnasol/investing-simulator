import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Message } from 'primereact/message';

// API
import { acceptInvite } from "api/Competition/Competition";

// Components
import { Skeleton } from "primereact/skeleton";
import Card from "components/PrimeReact/Card/Card";


const InviteAccepted = () => {
  const { competitionId } = useParams();
  const [isPlayerAlreadyInCompetition, setIsPlayerAlreadyInCompetition] = useState<boolean>(false);
  const [isCompetitionSizeFilled, setIsCompetitionSizeFilled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      // get competition id from query string in URL
      const result = await acceptInvite(competitionId);
      if (result.data.isCompetitionFilled) {
        setIsCompetitionSizeFilled(true);
      }

      if (result.data.isPlayerAlreadyInCompetition) {
        setIsPlayerAlreadyInCompetition(true);
      }

      setIsLoading(false);
    }

    fetchData();
  }, []);

  const link = `${process.env.REACT_APP_URL}/competition?id=${competitionId}`;
  const title = () => {
    if (isCompetitionSizeFilled) {
      return (
        <div>
          Sorry..
        </div>
      );
    }

    if (isPlayerAlreadyInCompetition) {
      return (
        <div>
          Oops!
        </div>
      );
    }

    return (
      <div>
        Invitation Accepted!
      </div>
    );
  }

  const titleText = title();
  return (
    <div className="flex justify-content-center">
      {isLoading
        ? <Skeleton className="w-full" height="8rem" />
        : <Card className="mt-3 w-30rem flex justify-content-center" title={titleText}>
          {!isCompetitionSizeFilled && !isPlayerAlreadyInCompetition
            && <Message severity="success" text="View the competition in your competitions list!" />}

          {isCompetitionSizeFilled && <Message severity="error" text="Sorry, the competition is already filled!" />}

          {isPlayerAlreadyInCompetition && <Message severity="info" text="You're already in this competition!" />}
        </Card>
      }
    </div>
  );
}

export default InviteAccepted;