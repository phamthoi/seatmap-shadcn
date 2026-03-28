import { DataTable, List } from '@/components/admin'
import { SeatPlanDownloadButton } from './SeatPlanDownloadButton'

export const SeatPlanList = () => (
  <List
    resource="seat-plans"
    queryOptions={{
      meta: {
        include: [
          {
            relation: 'histories',
            scope: {
              order: ['createAt DESC'],
              limit: 1,
              include: [{ relation: 'user' }],
            },
          },
        ],
      },
    }}
  >
    <DataTable>
      <DataTable.Col source="id" />
      <DataTable.Col
        source="histories[0].user.email"
        label="Email"
        render={(record) => record?.histories[0]?.user?.email ?? 'System'}
      />
      <DataTable.Col source="name" />
      <DataTable.Col source="createAt" />
      <DataTable.Col source="updateAt" />
      <DataTable.Col
        source="id"
        label="Action"
        render={(record) => <SeatPlanDownloadButton record={record} />}
      />
    </DataTable>
  </List>
)