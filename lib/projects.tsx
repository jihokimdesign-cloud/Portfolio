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

const fileNames = fs
  .readdirSync(DOCS_DIRECTORY)
  // .mdx만, 그리고 "cheffy 2.mdx" 같은 파인더 복사본은 제외
  .filter((name) => name.endsWith(".mdx") && !/\s/.test(name));
export function getAllPostSlugs() {
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.mdx$/, ""),
      },
    };
  });
}
