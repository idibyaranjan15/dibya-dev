import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Get all the `.mdx` files from the specified directory
const getMDXFiles = (dir: string): string[] => {
  try {
    return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
  } catch (error) {
    console.error(`Error reading directory: ${dir}`, error);
    return [];
  }
};

// Read data from an `.mdx` file
const readMDXFile = (filePath: string): matter.GrayMatterFile<string> => {
  try {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    return matter(rawContent);
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    return { data: {}, content: "", excerpt: undefined, orig: "" }; // Use valid properties only
  }
};

// Retrieve metadata and content from all `.mdx` files in the directory
const getMDXData = (
  dir: string
): { metadata: Record<string, unknown>; slug: string; content: string }[] => {
  const mdxFiles = getMDXFiles(dir);

  return mdxFiles.map((file) => {
    const filePath = path.join(dir, file);
    const { data: metadata, content } = readMDXFile(filePath);
    const slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
};

// Export a function to retrieve blog posts
export const getBlogPosts = (): {
  metadata: Record<string, unknown>;
  slug: string;
  content: string;
}[] => {
  const blogDirectory = path.join(
    process.cwd(),
    "src",
    "app",
    "blog",
    "contents"
  );
  return getMDXData(blogDirectory);
};
