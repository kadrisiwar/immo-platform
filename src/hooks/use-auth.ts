import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: "proprietaire" | "locataire";
  phone?: string;
}

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const res = await api.post("/accounts/token/", data);
      return res.data;
    },
    onSuccess: (data) => {
      // جيب user info
      api
        .get("/accounts/me/", {
          headers: { Authorization: `Bearer ${data.access}` },
        })
        .then((res) => {
          setAuth(res.data, data.access, data.refresh);

          // redirect حسب الـ role
          const role = res.data.role;
          if (role === "admin") router.push("/admin");
          else if (role === "proprietaire") router.push("/proprietaire");
          else router.push("/locataire/favoris");
        });
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const res = await api.post("/accounts/register/", data);
      return res.data;
    },
    onSuccess: () => {
      router.push("/login");
    },
  });
}
