import { useProfileQuery } from "@/hooks/queries/useAuthQuery";

export const SessionHydrator: React.FC = () => {
  useProfileQuery();
  return null;
};

export default SessionHydrator;
