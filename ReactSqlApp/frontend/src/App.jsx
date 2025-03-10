import CreateUser from '../components/CreateUser';
import ReadDeleteUsers from '../components/ReadDeleteUsers';
import UpdateUser from '../components/UpdateUser';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [refresh, setRefresh] = useState(0);

  return (
    
    <div className="container mt-4 ">
      <h1 className="text-center mb-4 ">User Management</h1>
      <div className="card shadow mb-4 bg-light">
        <div className="card-body">
          <CreateUser onUserAdded={() => setRefresh(prev => prev + 1)} />
        </div>
      </div>
      <div className="card shadow mb-4 bg-light">
        <div className="card-body">
          <ReadDeleteUsers refresh={refresh} />
        </div>
      </div>
      <div className="card shadow mb-4 bg-light">
        <div className="card-body">
          <UpdateUser onUserUpdated={() => setRefresh(prev => prev + 1)} />
        </div>
      </div>
    </div>
  );
}

export default App;