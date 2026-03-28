import {
    DataTable,
    List,
    ReferenceField,
    EditButton,
} from "@/components/admin";

export const PostList = () => (
    <List>
        <DataTable rowClick={false}>
            <DataTable.Col source="id"/>
            <DataTable.Col source="userId">
                <ReferenceField source="userId" reference="users" />
            </DataTable.Col>
            <DataTable.Col source="title" />
            <DataTable.Col>
                <EditButton />
            </DataTable.Col>
        </DataTable>
    </List>
);