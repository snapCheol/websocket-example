import { createBrowserRouter } from 'react-router';

import HomePage from '@/pages/home';

const router = createBrowserRouter([{ path: '/', element: <HomePage /> }]);

export default router;
