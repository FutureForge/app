import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// syntax
export function useMutationExample() {
  // call needed functions

  return useMutation({
    mutationFn: async () => {
      // your mutation logic here
    },
    onSuccess: (data, variables, context) => {
      // your success callback here
    },
    onError: (error, variables, context) => {
      // your error callback here
    },
    // other options like retry, etc.
  });
}

export function useAddCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCollection: {
      collectionContractAddress: string;
      name: string;
      description: string;
    }) => {
      console.log(newCollection);

      const response = await axios.post("/api/collection", newCollection);
      return response.data; // handle success response
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["collections"],
      });
    },
    onError: (error) => {
      console.error("Error adding collection:", error);
    },
  });
}
