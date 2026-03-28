import { DataTable, List } from "@/components/admin"

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
        </DataTable>
    </List>
)