import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useFetchCollectionsQuery() {
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
