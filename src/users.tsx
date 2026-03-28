import { DataTable, List } from "@/components/admin";
import { UrlField } from "@/components/url-field"
export const UserList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="name" />
            <DataTable.Col source="username" />
            <DataTable.Col source="email" />
            <DataTable.Col source="address.street" />
            <DataTable.Col source="phone" />
            <DataTable.Col source="website" field={UrlField}/>
            <DataTable.Col source="company.name" />
        </DataTable>
    </List>
);