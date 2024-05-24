import useSWR from "swr";

const defaultFetcher = async (url) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export const useUser = (fetcher = defaultFetcher, options = {}) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    "/api/users",
    fetcher,
    { dedupingInterval: 5 * 60 * 1000, ...options }
  );

  return { user: data, error, isLoading, isValidating, mutate };
};

export const useUserTeams = (fetcher = defaultFetcher, options = {}) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    "/api/users/teams",
    fetcher,
    { dedupingInterval: 5 * 60 * 1000, ...options }
  );

  return { teams: data, error, isLoading, isValidating, mutate };
};

export const useTeam = (teamId, fetcher = defaultFetcher, options = {}) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `/api/teams/${teamId}`,
    fetcher,
    { dedupingInterval: 5 * 60 * 1000, ...options }
  );

  return { team: data, error, isLoading, isValidating, mutate };
};

export const useTeamMembers = (
  teamId,
  fetcher = defaultFetcher,
  options = {}
) => {
  // TODO: 新增 conditional fetching
  // if (!teamId) teamId = useSelector((state) => state.user.teams.joined[0]);

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `/api/teams/${teamId}/members`,
    fetcher,
    { dedupingInterval: 5 * 60 * 1000, ...options }
  );

  return { members: data, error, isLoading, isValidating, mutate };
};
