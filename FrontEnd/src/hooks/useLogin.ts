import { useMutation } from "@tanstack/react-query";
import { login } from "../api/authApi";
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from "react-router";

export function useLogin() {

    const navigate = useNavigate();

    const { setAuthentication } = useAuth();

    return useMutation({

        mutationFn: login,

        onSuccess: (data) => {
           console.log("response",data)
            setAuthentication(data);

            navigate("/admin/dashboard");
        }
    });
}