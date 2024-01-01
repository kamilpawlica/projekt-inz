import React from 'react'
import EmployeeList from '../components/EmployeeList'
import "../pages/AdminPanel.css"
import BenefitsManagement from '../components/BenefitsManagement'
import PositionManagement from '../components/PositionManagement'
import CompetencesManagement from '../components/CompetencesManagement'
import ContractManagement from '../components/ContractManagement'
import CourseManagement from '../components/CourseManagement'
const AdminPanel = () => {
  return (
    <div>
    <h1><center>Panel administratora </center></h1>
    <div className='uklad'>
    <EmployeeList/>
    <BenefitsManagement/>
    <PositionManagement/>
    <CompetencesManagement/>
    <ContractManagement/>
    <CourseManagement/>
    
    
    
    </div>
    
    </div>
  )
}

export default AdminPanel