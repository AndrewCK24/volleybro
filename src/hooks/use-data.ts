import useSWR, { useSWRConfig } from "swr";
import type { Team } from "@/entities/team";
import type { Member } from "@/entities/member";
import type { Record } from "@/entities/record";

class FetchError extends Error {
  info: any;
  status: number;

  constructor(message: string, info: any, status: number) {
    super(message);
    this.info = info;
    this.status = status;
  }
}

const defaultFetcher = async (url: string) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // try to parse and throw it.
  if (!res.ok) {
    const info = await res.json();
    const error = new FetchError(
      "An error occurred while fetching the data.",
      info,
      res.status
    );
    throw error;
  }

  return res.json();
};

const useHasCache = (key: string) => {
  const { cache } = useSWRConfig();
  return cache.get(key) !== undefined;
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

export const useTeam = (
  teamId: string,
  fetcher = defaultFetcher,
  options = {}
) => {
  const key = `/api/teams/${teamId}`;
  const hasCache = useHasCache(key);
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    Team,
    FetchError
  >(key, fetcher, {
    dedupingInterval: 5 * 60 * 1000,
    revalidateOnMount: !hasCache,
    ...options,
  });

  return { team: data, error, isLoading, isValidating, mutate };
};

export const useTeamMembers = (
  teamId: string,
  fetcher = defaultFetcher,
  options = {}
) => {
  const key = `/api/teams/${teamId}/members`;
  const hasCache = useHasCache(key);
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    Member[],
    FetchError
  >(key, fetcher, {
    dedupingInterval: 5 * 60 * 1000,
    revalidateOnMount: !hasCache,
    ...options,
  });

  return { members: data, error, isLoading, isValidating, mutate };
};

export const useRecord = (
  recordId: string,
  fetcher = defaultFetcher,
  options = {}
) => {
  const key = `/api/records/${recordId}`;
  const hasCache = useHasCache(key);
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    Record,
    FetchError
  >(recordId ? key : null, fetcher, {
    dedupingInterval: 5 * 60 * 1000,
    revalidateOnMount: !hasCache,
    ...options,
  });

  return { record: data, error, isLoading, isValidating, mutate };
};

export const useTeamRecords = (
  teamId: string,
  fetcher = defaultFetcher,
  options = {}
) => {
  const key = `/api/records?ti=${teamId}`;
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
