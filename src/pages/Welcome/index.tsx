import AdminIndex from '@/components/AdminIndex';
import AgentIndex from '@/components/AgentIndex';
import { getLoginDto } from '@/util';

const Welcome: React.FC = () => {
  return (
    <>
      {getLoginDto() != null && getLoginDto().role === 'system_admin' ? (
        <AdminIndex />
      ) : (
        <AgentIndex />
      )}
    </>
  );
};

export default Welcome;
