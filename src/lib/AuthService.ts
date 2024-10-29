import axiosClient from "@/axios-client";


export async function login(
  setLoading: Function,
  username: String,
  password: String,
  setToken: Function,
  setUser: Function
) {
  try {
    setLoading(true);
    const response = await axiosClient.post("/auth/login",
      {
        username: username,
        password: password
      }
    )

    if (response?.data?.data?.access_token) {
      setUser(response?.data?.data?.user);
      localStorage.setItem("TOKEN", response?.data?.data?.access_token);
      setToken(response?.data?.data?.access_token)
    }
  }
  catch (e) {
    throw e;
  }
  finally {
    setLoading(false);
  }
}