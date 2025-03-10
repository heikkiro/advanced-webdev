import CreateUser from '../components/CreateUser'
import ReadDeleteUsers from '../components/ReadDeleteUsers'
import UpdateUser from '../components/UpdateUser'
import { useState } from 'react'

function App() {
  const [refresh, setRefresh] = useState(0);

  return (
      <div>
        <CreateUser onUserAdded={() => setRefresh(prev => prev +1)} />
        <ReadDeleteUsers refresh={refresh} />
        <UpdateUser />
      </div>
  );
}

export default App