import topicsData from "./topics.json";
import { Topic, Level } from "./types";

const allTopics: Topic[] = topicsData as Topic[];

export function getAllTopics(): Topic[] {
  return allTopics;
}

export function getTopicsByLevel(level: Level): Topic[] {
  return allTopics.filter((t) => t.level === level);
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return allTopics.find((t) => t.slug === slug);
}

export function searchTopics(query: string): Topic[] {
  const q = query.toLowerCase();
  return allTopics.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.content.toLowerCase().includes(q)
  );
}
