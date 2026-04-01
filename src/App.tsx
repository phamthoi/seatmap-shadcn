import { Resource, CustomRoutes } from "ra-core"
import { FileClockIcon, ScrollTextIcon } from "lucide-react"
import { Admin } from "@/components/admin";
import { dataProvider, authProvider } from "./provider"
import { HistoryList } from "@/pages/histories"
import { SeatPlanList } from "@/pages/seat-plans"
import { BrowserRouter, Route } from "react-router-dom"
import { SeatConfigPage } from "@/pages/seat-config"
import { PreviewPage } from "@/pages/preview"

const App = () => (
  <BrowserRouter>
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
      <Resource name="seat-plans" icon={ScrollTextIcon} list={SeatPlanList} />
      <Resource name="histories" icon={FileClockIcon} list={HistoryList} />
      <CustomRoutes>
        <Route path="/seat-config" element={<SeatConfigPage />} />
        <Route path="/preview" element={<PreviewPage />} />
      </CustomRoutes>
    </Admin>
  </BrowserRouter>
)
export default App;