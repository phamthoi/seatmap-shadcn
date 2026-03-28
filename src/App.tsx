import { Resource } from "ra-core"
import { FileClockIcon, ScrollTextIcon } from "lucide-react"
import { Admin } from "@/components/admin";
import { dataProvider, authProvider } from "./provider"
import { HistoryList } from "@/components"
import { SeatPlanList } from "@/pages/seat-plans/SeatPlan"
import { BrowserRouter } from "react-router-dom"

const App = () => (
<BrowserRouter>  
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
  >
    <Resource name="seat-plans" icon={ScrollTextIcon} list={SeatPlanList}/>
    <Resource name="histories" icon={FileClockIcon} list={HistoryList} />
  </Admin>
</BrowserRouter>
);
export default App;