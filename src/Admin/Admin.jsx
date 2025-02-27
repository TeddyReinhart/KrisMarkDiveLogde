
import AdminNavbar from './AdminNavbar';
import { Outlet } from 'react-router-dom';

const Admin = () => {
    return (
      <div className='flex'>
          <AdminNavbar/>
          <main className='flex-1 ml-60 p-8'>
            <Outlet />
          </main>
    
      </div>
    );
}

export default Admin