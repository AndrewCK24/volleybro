import useSWR from "swr";

const customFetcher = (url) => fetch(url).then((r) => r.json());

export const useUserTeams = (fetcher = customFetcher, options = {}) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    "/api/users/teams",
    fetcher,
    { dedupingInterval: 5 * 60 * 1000, ...options }
  );

  return { teams: data, error, isLoading, isValidating, mutate };
};
