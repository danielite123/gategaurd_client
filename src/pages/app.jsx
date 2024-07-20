import { Helmet } from 'react-helmet-async';

import { AppView } from 'src/sections/app/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard | GateGaurd </title>
      </Helmet>

      <AppView />
    </>
  );
}
