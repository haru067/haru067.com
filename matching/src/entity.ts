export interface Group {
    id: number,
    name: string,
    participants: Participant[],
};

export interface Participant {
    id: number,
    name: string,
};
