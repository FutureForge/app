import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// syntax
export function useQueryExample() {
  // call needed functions

  return useQuery({
    queryKey: ["exampleQueryKey"],
    queryFn: async () => {},
    initialData: null,
    enabled: true,
    refetchInterval: 60000, // refetch every minute
  });
}

export function useFetchCollections() {
  return useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const response = await axios.get("/api/collection");
      return response.data.data; // returning the array of collections
    },
    initialData: [],
    refetchInterval: 60000, // refetch every minute
    staleTime: 5000, // set stale time to avoid unnecessary refetching
  });
}
