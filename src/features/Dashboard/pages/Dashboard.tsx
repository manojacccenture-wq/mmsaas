import { useAppSelector } from "@/app/store/hook"
import TenantSwitcher from "@/shared/components/tenantSwitcher/tenantSwitcher"


const Dashboard = () => {

  return (
    <div>
      Dashboard
       <TenantSwitcher />
    </div>
  )
}

export default Dashboard
