import { EXPRESS } from '@services/enviroments';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

const sessionLinkServer = async (req: NextApiRequest, res: NextApiResponse) => {
  const { code_invitation } = req.query;
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    try {
      const response = await axios.post(
        `${EXPRESS}/api/servers/invitation?invitation=${code_invitation}&user=${session.user._id}`
      );
      // console.log(response.data);

      res.redirect(`/channels/${response.data._userServer.server}`);
    } catch (err: any) {
      console.error(err.response);
    }
  } else {
    res.redirect(`/auth/signin?code_invitation=${code_invitation}`);
  }
};

export default sessionLinkServer;
