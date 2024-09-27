import useSWR, { useSWRConfig } from "swr";

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

const useHasCache = (key) => {
  const { cache } = useSWRConfig();
  return cache.has(key);
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
  const key = `/api/teams/${teamId}`;
  const hasCache = useHasCache(key);
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key,
    fetcher,
    {
      dedupingInterval: 5 * 60 * 1000,
      revalidateOnMount: !hasCache,
      ...options,
    }
  );

  return { team: data, error, isLoading, isValidating, mutate };
};

export const useTeamMembers = (
  teamId,
  fetcher = defaultFetcher,
  options = {}
) => {
  const key = `/api/teams/${teamId}/members`;
  const hasCache = useHasCache(key);
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key,
    fetcher,
    {
      dedupingInterval: 5 * 60 * 1000,
      revalidateOnMount: !hasCache,
      ...options,
    }
  );

  return { members: data, error, isLoading, isValidating, mutate };
};

export const useRecord = (recordId, fetcher = defaultFetcher, options = {}) => {
  const key = `/api/records/${recordId}`;
  const hasCache = useHasCache(key);
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    recordId ? key : null,
    fetcher,
    {
      dedupingInterval: 5 * 60 * 1000,
      revalidateOnMount: !hasCache,
      ...options,
    }
  );

  return { record: data, error, isLoading, isValidating, mutate };
};

export const useTeamRecords = (
  teamId,
  fetcher = defaultFetcher,
  options = {}
) => {
  const key = `/api/records?teamId=${teamId}`;
  const hasCache = useHasCache(key);
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key,
    fetcher,
    {
      dedupingInterval: 5 * 60 * 1000,
      revalidateOnMount: !hasCache,
      ...options,
    }
  );

  return { records: data, error, isLoading, isValidating, mutate };
};
