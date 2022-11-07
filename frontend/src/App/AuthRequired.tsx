import { Outlet, useNavigate } from "react-router-dom";
import ContentInMiddle from "../Components/ContentInMiddle";
import useCurrentUser from "../Global/Api/Queries/useCurrentUser";
/* import { useAuthentication } from "../Global/Api/Client"; */

export default function AuthRequired() {
  /* const [token, _] = useAuthentication(); */
  /* const navigate = useNavigate(); */
  /**/
  /* if (!token) { */
  /*   navigate("/login"); */
  /* } */

  const _ = useCurrentUser();

  return (
    <ContentInMiddle>
      <Outlet />
    </ContentInMiddle>
  );
}
