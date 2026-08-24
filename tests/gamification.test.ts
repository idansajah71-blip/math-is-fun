import { describe, it, expect, beforeEach } from "vitest";
import {
  getProfile,
  saveProfile,
  getDefaultProfile,
  addXp,
  addGems,
  useHeart,
  refillHearts,
  completeTopic,
  purchaseItem,
  toggleBookmark,
  saveQuizScore,
  trackWrongAnswer,
  getWeakTopics,
  consumeDoubleXp,
  setProfileName,
  getLevelForXp,
  getXpForNextLevel,
  getXpForCurrentLevel,
  LEVEL_THRESHOLDS,
  BADGES,
  SHOP_ITEMS,
  STORAGE_KEY,
} from "@/lib/gamification";

beforeEach(() => {
  localStorage.clear();
});

describe("getDefaultProfile", () => {
  it("returns a valid default profile", () => {
    const p = getDefaultProfile();
    expect(p.name).toBe("Pelajar");
    expect(p.xp).toBe(0);
    expect(p.gems).toBe(50);
    expect(p.hearts).toBe(5);
    expect(p.maxHearts).toBe(5);
    expect(p.streak).toBe(0);
    expect(p.badges).toEqual([]);
    expect(p.completedTopics).toEqual([]);
    expect(p.quizScores).toEqual({});
    expect(p.purchasedItems).toEqual([]);
  });
});

describe("getProfile / saveProfile", () => {
  it("creates and persists a profile", () => {
    const p = getProfile();
    expect(p.name).toBe("Pelajar");
    expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy();
  });

  it("persists mutations", () => {
    const p = getProfile();
    p.name = "Budi";
    saveProfile(p);
    const p2 = getProfile();
    expect(p2.name).toBe("Budi");
  });
});

describe("addXp", () => {
  it("adds XP and updates level", () => {
    const p = addXp(100);
    expect(p.xp).toBe(100);
    expect(p.level).toBe(getLevelForXp(100));
  });

  it("increments level when threshold crossed", () => {
    addXp(49);
    const p = addXp(1);
    expect(p.xp).toBe(50);
    expect(p.level).toBeGreaterThanOrEqual(1);
  });
});

describe("addGems", () => {
  it("adds gems", () => {
    const p = addGems(10);
    expect(p.gems).toBe(60); // default 50 + 10
  });
});

describe("useHeart / refillHearts", () => {
  it("decreases hearts on useHeart", () => {
    const used = useHeart();
    expect(used).toBe(true);
    const p = getProfile();
    expect(p.hearts).toBe(4);
  });

  it("refills hearts to maxHearts", () => {
    useHeart();
    useHeart();
    const p = refillHearts();
    expect(p.hearts).toBe(p.maxHearts);
  });
});

describe("completeTopic", () => {
  it("awards XP and gems for first completion", () => {
    const result = completeTopic("test-topic");
    expect(result.xp).toBe(25);
    expect(result.gems).toBe(5);
    expect(result.profile.completedTopics).toContain("test-topic");
  });

  it("does not award XP for repeat completion", () => {
    completeTopic("test-topic");
    const result = completeTopic("test-topic");
    expect(result.xp).toBe(0);
  });
});

describe("purchaseItem", () => {
  it("purchases streak-freeze with enough gems", () => {
    const p = getProfile();
    p.gems = 200;
    p.streakFreeze = 0;
    saveProfile(p);
    const p2 = purchaseItem("streak-freeze");
    expect(p2.purchasedItems).toContain("streak-freeze");
    expect(p2.streakFreeze).toBeGreaterThanOrEqual(1);
    expect(p2.gems).toBe(100); // 200 - 100
  });

  it("does not purchase if not enough gems", () => {
    const p = getProfile();
    p.gems = 10;
    saveProfile(p);
    const p2 = purchaseItem("streak-freeze");
    expect(p2.purchasedItems).not.toContain("streak-freeze");
  });

  it("purchases double-xp and sets flag", () => {
    const p = getProfile();
    p.gems = 500;
    saveProfile(p);
    const p2 = purchaseItem("double-xp");
    expect(p2.doubleXpNextLesson).toBe(true);
  });
});

describe("consumeDoubleXp", () => {
  it("returns true and clears flag", () => {
    const p = getProfile();
    p.doubleXpNextLesson = true;
    saveProfile(p);
    const used = consumeDoubleXp();
    expect(used).toBe(true);
    const p2 = getProfile();
    expect(p2.doubleXpNextLesson).toBe(false);
  });

  it("returns false when not set", () => {
    const used = consumeDoubleXp();
    expect(used).toBe(false);
  });
});

describe("toggleBookmark", () => {
  it("adds and removes bookmarks", () => {
    const p = toggleBookmark("topic-a");
    expect(p.bookmarkedTopics).toContain("topic-a");
    const p2 = toggleBookmark("topic-a");
    expect(p2.bookmarkedTopics).not.toContain("topic-a");
  });
});

describe("saveQuizScore", () => {
  it("saves quiz score", () => {
    const p = saveQuizScore("quiz-topic", 85);
    expect(p.quizScores["quiz-topic"]).toBe(85);
  });
});

describe("trackWrongAnswer / getWeakTopics", () => {
  it("tracks wrong answers and returns weak topics", () => {
    trackWrongAnswer("weak-topic");
    trackWrongAnswer("weak-topic");
    trackWrongAnswer("strong-topic");
    const weak = getWeakTopics(5);
    expect(weak[0]).toBe("weak-topic");
  });
});

describe("setProfileName", () => {
  it("updates name", () => {
    const p = setProfileName("Andi");
    expect(p.name).toBe("Andi");
  });
});

describe("Level helpers", () => {
  it("getLevelForXp returns 0 for 0 XP", () => {
    expect(getLevelForXp(0)).toBe(0);
  });

  it("getXpForNextLevel returns correct threshold", () => {
    expect(getXpForNextLevel(0)).toBe(LEVEL_THRESHOLDS[1]);
  });

  it("getXpForCurrentLevel returns correct threshold", () => {
    expect(getXpForCurrentLevel(0)).toBe(LEVEL_THRESHOLDS[0]);
  });
});

describe("BADGES", () => {
  it("all badges have valid conditions", () => {
    const p = getDefaultProfile();
    for (const badge of BADGES) {
      expect(typeof badge.condition(p)).toBe("boolean");
    }
  });
});

describe("SHOP_ITEMS", () => {
  it("has unique IDs", () => {
    const ids = SHOP_ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
