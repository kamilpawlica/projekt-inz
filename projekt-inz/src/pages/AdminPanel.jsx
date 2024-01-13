import React from 'react'
import EmployeeList from '../components/EmployeeList'
import "../pages/AdminPanel.css"
import BenefitsManagement from '../components/BenefitsManagement'
import PositionManagement from '../components/PositionManagement'
import CompetencesManagement from '../components/CompetencesManagement'
import ContractManagement from '../components/ContractManagement'
import CourseManagement from '../components/CourseManagement'
import EmployeeVacations from '../components/EmployeeVacations'
import EmployeeAbsences from '../components/EmployeeAbsences'
import EmployeeAvailability from '../components/EmployeeAvailability'
const AdminPanel = () => {
  
  return (
    <div className="admin-panel">
    <h1 className="admin-panel-title">Panel administratora</h1>
    <div className="uklad">
      
        <EmployeeList />      
        <BenefitsManagement />
        <PositionManagement />
        <CompetencesManagement />
        <ContractManagement />         
        <CourseManagement />
        <EmployeeAvailability />
        <EmployeeVacations />
        <EmployeeAbsences />
    </div>
</div>

  )
}

export default AdminPanel