import { Typography } from "@/components/typography";

export default function BlogIndex() {
  return (
    <div className="mx-auto max-w-2xl py-12">
      <Typography variant="h1" className="mb-4">
        Blog
      </Typography>
      <Typography variant="p">
        This is the blog index page. List your blog posts here.
      </Typography>
    </div>
  );
}
