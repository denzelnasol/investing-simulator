import React, { useState, useEffect } from "react";
import { useParams, useSearchParams  } from "react-router-dom";
import { Message } from 'primereact/message';

// API
import { acceptInvite } from "api/Competition/Competition";

// Components
import { Skeleton } from "primereact/skeleton";
import Card from "components/PrimeReact/Card/Card";


const InviteAccepted = () => {
  const { competitionId } = useParams();
  const [searchParams] = useSearchParams();

  const [isPlayerAlreadyInCompetition, setIsPlayerAlreadyInCompetition] = useState<boolean>(false);
  const [isCompetitionSizeFilled, setIsCompetitionSizeFilled] = useState<boolean>(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      // get competition id from query string in URL
      const result = await acceptInvite(searchParams.get('id'));

      if (!result) {
        setIsUserLoggedIn(false);
      } else if (result.data.isCompetitionFilled) {
        setIsCompetitionSizeFilled(true);
      } else if (result.data.isPlayerAlreadyInCompetition) {
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

    if (!isUserLoggedIn) {
      return (
        <div>
          Uh oh..
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
          {!isCompetitionSizeFilled && !isPlayerAlreadyInCompetition && isUserLoggedIn
            && <Message severity="success" text="View the competition in your competitions list!" />}

          {isCompetitionSizeFilled && <Message severity="error" text="Sorry, the competition is already filled!" />}

          {!isUserLoggedIn && <Message severity="error" text="Log in before accepting the invite!" />}

          {isPlayerAlreadyInCompetition && <Message severity="info" text="You're already in this competition!" />}
        </Card>
      }
    </div>
  );
}

export default InviteAccepted;