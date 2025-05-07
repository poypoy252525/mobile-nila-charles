export interface Schedule {
  studentId: string | null;
  status: ScheduleStatus;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  examId: string;
  date: Date;
  duration: number;
}

enum ScheduleStatus {
  APPROVED,
  DONE,
  DECLINED,
}
