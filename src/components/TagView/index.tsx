import RightContent from '../RightContent';
import TagsView from './tagsView';
import styles from './index.less';
import { getUserMenus } from '@/util';

function TagView() {
  const excludePage = ['/login'];
  return (
    <div className={styles.tag_view}>
      <RightContent />
      <div className={styles.tabs}>
        <TagsView titles={getUserMenus()} excludePage={excludePage} />
      </div>
    </div>
  );
}

export default TagView;
