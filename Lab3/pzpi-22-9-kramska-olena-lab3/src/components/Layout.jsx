import TopBar from './TopBar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <TopBar />
<div style={{ paddingTop: '40px' }}>
  <Outlet />
</div>
    </>
  );
};

export default Layout;
