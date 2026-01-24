import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';

const Footer: React.FC = () => {
  const defaultMessage = 'Kevin出品 必属精品';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'Leo Design',
          title: 'Leo Design',
          href: 'https://www.banshanren.com',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://www.banshanren.com',
          blankTarget: true,
        },
        {
          key: 'Tom Code',
          title: 'Tom Code',
          href: 'https://www.banshanren.com',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
