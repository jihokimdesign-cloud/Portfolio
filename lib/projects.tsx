import matter from "gray-matter";
import { join } from "path";
import fs from "fs";

const DOCS_DIRECTORY = join(process.cwd(), "projects");

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = join(DOCS_DIRECTORY, `${realSlug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  data.slug = realSlug;

  return { meta: data, content };
}

const fileNames = fs.readdirSync(DOCS_DIRECTORY);
export function getAllPostSlugs() {
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.mdx$/, ""),
      },
    };
  });
}
