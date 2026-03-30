export interface HistoryRecord {
    id: number
    seatName: string
    createAt: string
}

export interface HistoryProps {
    record: HistoryRecord
}