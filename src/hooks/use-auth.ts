import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
          // ========== إضافة Remember Me ==========
          // تخزين التوكن حسب خيار "تذكرني"
          if (localStorage.getItem("remember_me") === "true") {
            // حفظ في localStorage (يبقى حتى بعد إغلاق المتصفح)
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);
          } else {
            // حفظ في sessionStorage (ينحذف عند إغلاق المتصفح)
            sessionStorage.setItem("access_token", data.access);
            sessionStorage.setItem("refresh_token", data.refresh);
          }
          // ======================================

          setAuth(res.data, data.access, data.refresh);
          
          // Success toast
          toast.success(`Bienvenue ${res.data.username}! 🎉`);

          // redirect حسب الـ role
          const role = res.data.role;
          if (role === "admin") router.push("/admin");
          else if (role === "proprietaire") router.push("/proprietaire");
          else router.push("/locataire/favoris");
        })
        .catch(() => {
          toast.error("Erreur lors de la récupération des données utilisateur");
        });
    },
    onError: () => {
      toast.error("Identifiants incorrects. Veuillez réessayer.");
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
      toast.success("Inscription réussie! Connectez-vous avec vos identifiants.");
      router.push("/login");
    },
    onError: () => {
      toast.error("Erreur lors de l'inscription. Vérifiez vos données.");
    },
  });
}