import { useParams } from "react-router-dom";

import { Typography } from "@/components/typography";

export default function UserProfile() {
  const { id } = useParams();

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <Typography variant="h1" className="mb-4">
        User Profile: {id}
      </Typography>
      <Typography variant="p">
        This is a dynamic user profile page. The user ID is <code>{id}</code>.
      </Typography>
    </div>
  );
}
