import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useMutationExample() {
  return useMutation({
    mutationFn: async () => {},
    onSuccess: (data, variables, context) => {},
    onError: (error, variables, context) => {},
  });
}
