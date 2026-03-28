import { Resource } from "ra-core"
import { FileClockIcon, ScrollTextIcon } from "lucide-react"
import { Admin } from "@/components/admin";
import { dataProvider, authProvider } from "./provider"
import { HistoryList } from "@/components"
import { SeatPlanList } from "@/pages/seat-plans/SeatPlan"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { SeatConfigPage } from "@/pages/seat-config/SeatConfigPage"

// const App = () => (
// <BrowserRouter>  
//   <Admin
//     dataProvider={dataProvider}
//     authProvider={authProvider}
//   >
//     <CustomRoutes>
//         <Route path="/seat-config" element={<SeatConfigPage />} />
//       </CustomRoutes>
//     <Resource name="seat-plans" icon={ScrollTextIcon} list={SeatPlanList}/>
//     <Resource name="histories" icon={FileClockIcon} list={HistoryList} />
//   </Admin>
// </BrowserRouter>
// );

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* 1. Trang cấu hình riêng lẻ */}
      <Route path="/seat-config" element={<SeatConfigPage />} />

      {/* 2. Toàn bộ trang Admin (bao gồm các Resource) */}
      <Route
        path="/*"
        element={
          <Admin dataProvider={dataProvider} authProvider={authProvider}>
            <Resource name="seat-plans" icon={ScrollTextIcon} list={SeatPlanList} />
            <Resource name="histories" icon={FileClockIcon} list={HistoryList} />
          </Admin>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default App;