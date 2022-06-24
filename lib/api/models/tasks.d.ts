export interface TasksObject {
    [key: string]: Task;
}
export interface Task {
    qt_id: string;
    category: string;
    status: {
        id: number;
        name: string;
    };
    created_at: string;
    started_at: string;
    finished_at: string;
    metadata: {
        w_id: string;
        p_id: string;
    };
}
