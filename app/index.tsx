import { Redirect } from "expo-router";
import { Loading } from "../src/components/Loading";
import { useAuth } from "../src/contexts/AuthContext";

export default function Index() {
  const {user, isLoading} = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
}
