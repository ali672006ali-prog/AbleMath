export type AppScreen = 'home' | 'lesson1' | 'lesson2' | 'reward';

export type LessonId = 1 | 2;

export type NumeralStyle = 'western' | 'eastern';

export type RabbitMood = 'happy' | 'cheering' | 'encouraging' | 'thinking';

export interface LessonProgress {
  lessonId: LessonId;
  stageIndex: number; // 0 = تعلم، 1 = نشاط 1، 2 = نشاط 2، 3 = نشاط 3
  stars: number;
}
