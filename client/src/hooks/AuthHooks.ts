import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export const useLogin = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: any) => {
      // const login =
    },
  });
};
