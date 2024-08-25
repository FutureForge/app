import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useAddCollectionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCollection: {
      collectionContractAddress: string;
      name: string;
      description: string;
    }) => {
      const response = await axios.post("/api/collection", newCollection);
      return response.data; // handle success response
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["collections"],
      });
    },
    onError: (error) => {},
  });
}
