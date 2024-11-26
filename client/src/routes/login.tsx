import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: () => <LoginPage />,
});

type Props = {};

const LoginPage = ({}: Props) => {
  return <>LoginPage</>;
};
