import { Helmet } from 'react-helmet-async';

import { RegisterView } from 'src/sections/register';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Register | GateGaurd </title>
      </Helmet>

      <RegisterView />
    </>
  );
}
