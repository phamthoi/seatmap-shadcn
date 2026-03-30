import { DataTable, List } from "@/components/admin"
import { HistoriesDownloadButton } from "./HistoriesDownloadButton"

export const HistoryList = () => (
    <List
    resource="histories" 
    queryOptions={{ 
        meta: { include: [{ relation: "user" }] } 
    }}> 
        <DataTable>
            <DataTable.Col source="id"/>
            <DataTable.Col source="user.email" label="Email" render={(record) => record?.user?.email ?? "Hệ thống"}/>
            <DataTable.Col source="seatName" />
            <DataTable.Col source="createAt" />
            <DataTable.Col
            source="id"
            label="Action"
            render={(record) => (
                <div className="flex items-center gap-2">
                <HistoriesDownloadButton record={record} />
                </div>
            )}
            />
        </DataTable>
    </List>
)