/**
 * Task status enumeration
 * Frontend display values
 */
export enum TaskStatus {
  TODO = 'ToDo',
  IN_PROGRESS = 'InProgress',
  DONE = 'Done',
}

/**
 * API status string values (for POST/PUT requests)
 */
export const TaskStatusApiStrings = {
  TODO: 'ToDo',
  IN_PROGRESS: 'InProgress',
  DONE: 'Done',
} as const;

/**
 * Maps TaskStatus enum to API string values (for POST/PUT)
 * API expects: "ToDo", "InProgress", "Done"
 */
export const TaskStatusToApiString = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.TODO:
      return TaskStatusApiStrings.TODO;
    case TaskStatus.IN_PROGRESS:
      return TaskStatusApiStrings.IN_PROGRESS;
    case TaskStatus.DONE:
      return TaskStatusApiStrings.DONE;
    default:
      return TaskStatusApiStrings.TODO;
  }
};

/**
 * Maps TaskStatus enum to API numeric values
 * API uses: 0 = TODO, 1 = IN_PROGRESS, 2 = DONE
 */
export const TaskStatusToApiValue = (status: TaskStatus): number => {
  switch (status) {
    case TaskStatus.TODO:
      return 0;
    case TaskStatus.IN_PROGRESS:
      return 1;
    case TaskStatus.DONE:
      return 2;
    default:
      return 0;
  }
};

/**
 * Maps API numeric values to TaskStatus enum
 * API uses: 0 = TODO, 1 = IN_PROGRESS, 2 = DONE
 */
export const ApiValueToTaskStatus = (value: number): TaskStatus => {
  switch (value) {
    case 0:
      return TaskStatus.TODO;
    case 1:
      return TaskStatus.IN_PROGRESS;
    case 2:
      return TaskStatus.DONE;
    default:
      return TaskStatus.TODO;
  }
};


