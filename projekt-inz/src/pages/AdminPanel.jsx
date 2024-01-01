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
    <div>
    <h1><center>Panel administratora </center></h1>
    <div className='uklad'>
    <EmployeeList/>
    <EmployeeAvailability/>
    <BenefitsManagement/>
    <PositionManagement/>
    <CompetencesManagement/>
    <ContractManagement/>
    <CourseManagement/>
    <EmployeeVacations/>
    <EmployeeAbsences/>
   
    
    
    </div>
    
    </div>
  )
}

export default AdminPanel