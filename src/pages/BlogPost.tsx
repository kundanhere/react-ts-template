import { useParams } from "react-router-dom";

import { Typography } from "@/components/typography";

export default function BlogPost() {
  const { slug } = useParams();

  return (
    <div className="mx-auto max-w-2xl py-12">
      <Typography variant="h1" className="mb-4">
        Blog Post: {slug}
      </Typography>
      <Typography variant="p">
        This is a dynamic blog post page. The slug is <code>{slug}</code>.
      </Typography>
    </div>
  );
}
