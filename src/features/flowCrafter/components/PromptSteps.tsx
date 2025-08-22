import { useAuth } from "../../../auth/useAuth";
import { useApiQuery } from "../../../utils/customHooks/apiHooks";
import { useGetGenericRequestQuery } from "../../../utils/services/genericService";

function PromptSteps() {
  const { user } = useAuth();

  const getPromptSteps = useApiQuery(
    useGetGenericRequestQuery,
    `/steps/getSteps?creatorId=${user.id}`,
    { skipQuery: !Boolean(user.id) }
  );

  const promptSteps = [
    {
      label: "System Steps",
      value: getPromptSteps?.data?.systemSteps || [],
    },
    {
      label: "Custom Steps",
      value: getPromptSteps?.data?.customSteps || [],
    },
  ];
  console.log(promptSteps);
  return <div></div>;
}

export default PromptSteps;
