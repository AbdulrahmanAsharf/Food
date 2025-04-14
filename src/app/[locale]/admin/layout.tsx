import React from 'react'
import AdminTabs from './_components/AdminTabs';


function AdminLayout({ children}:  { children: React.ReactNode; }) {
  return (
    <div>
        <AdminTabs  />
        {children}
    </div>
  )
}

export default AdminLayout;